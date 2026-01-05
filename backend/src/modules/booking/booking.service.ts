import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { BookingStatus } from '../../shared/enums/booking.enum';
import { BookingEntity } from '../../database/entities/booking.entity';
import { BookingItemEntity } from '../../database/entities/booking-item.entity';
import { SubCourtEntity } from '../../database/entities/sub-court.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UploadBookingBillDto } from './dto/upload-booking-bill.dto';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(BookingEntity)
    private readonly bookingRepository: Repository<BookingEntity>,
    @InjectRepository(BookingItemEntity)
    private readonly bookingItemRepository: Repository<BookingItemEntity>,
    @InjectRepository(SubCourtEntity)
    private readonly subCourtRepository: Repository<SubCourtEntity>,
  ) {}

  private readonly logger = new Logger(BookingService.name);

  private parseMinutes(time: string) {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  private overlaps(startA: number, endA: number, startB: number, endB: number) {
    return startA < endB && startB < endA;
  }

  async createBooking(userId: string, dto: CreateBookingDto) {
    const numericUserId = Number(userId);
    if (Number.isNaN(numericUserId)) {
      throw new BadRequestException('userId không hợp lệ');
    }

    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException('Cần ít nhất một lịch đặt sân.');
    }

    const subCourtIds = dto.items.map((item) => Number(item.courtId));
    if (subCourtIds.some((id) => Number.isNaN(id))) {
      throw new BadRequestException('courtId không hợp lệ');
    }

    const uniqueSubCourtIds = Array.from(new Set(subCourtIds));
    const subCourts = await this.subCourtRepository.find({
      where: { id: In(uniqueSubCourtIds) },
      relations: ['supperCourt'],
    });

    this.logger.debug(
      `subCourts=${JSON.stringify(
        subCourts.map((court) => ({
          id: court.id,
          supperCourtId: court.supperCourt?.id,
        })),
      )}`,
    );

    if (subCourts.length !== uniqueSubCourtIds.length) {
      throw new NotFoundException('Một hoặc nhiều court không tồn tại.');
    }

    const supperCourtIdFromDto = dto.supperCourtId
      ? Number(dto.supperCourtId)
      : undefined;
    this.logger.debug(`payload.supperCourtId=${dto.supperCourtId}`);
    if (
      supperCourtIdFromDto !== undefined &&
      Number.isNaN(supperCourtIdFromDto)
    ) {
      throw new BadRequestException('supperCourtId không hợp lệ');
    }

    const supperCourtIds = new Set<number>();
    for (const subCourt of subCourts) {
      if (!subCourt.supperCourt) {
        throw new BadRequestException(
          'Một court chưa được ghép với supper court.',
        );
      }
      supperCourtIds.add(Number(subCourt.supperCourt.id));
    }

    this.logger.debug(`deduced supCourtIds=${[...supperCourtIds]}`);
    if (supperCourtIds.size > 1) {
      throw new BadRequestException(
        'Các court phải nằm trong cùng một supper court.',
      );
    }

    const [supperCourtIdValue] = supperCourtIds;
    const supperCourtId = Number(supperCourtIdValue);
    if (!supperCourtId) {
      throw new BadRequestException('Supper court chưa xác định.');
    }

    if (
      supperCourtIdFromDto !== undefined &&
      supperCourtIdFromDto !== supperCourtId
    ) {
      this.logger.warn(
        `supCourt mismatch dto=${supperCourtIdFromDto} inferred=${supperCourtId}`,
      );
      throw new BadRequestException(
        'supperCourtId không trùng khớp với court lựa chọn.',
      );
    }

    const computedTotal = dto.items.reduce(
      (sum, item) => sum + Number(item.price),
      0,
    );

    if (computedTotal !== dto.totalPrice) {
      throw new BadRequestException(
        'Tổng giá trị các mục không khớp với totalPrice.',
      );
    }

    const parsedItems = dto.items.map((item) => {
      const startMinutes = this.parseMinutes(item.startTime);
      const endMinutes = this.parseMinutes(item.endTime);
      if (endMinutes <= startMinutes) {
        throw new BadRequestException(
          'startTime phải nhỏ hơn endTime trong mỗi mục',
        );
      }
      return {
        ...item,
        startMinutes,
        endMinutes,
        subCourtId: Number(item.courtId),
      };
    });

    for (let i = 0; i < parsedItems.length; i += 1) {
      for (let j = i + 1; j < parsedItems.length; j += 1) {
        const first = parsedItems[i];
        const second = parsedItems[j];
        if (
          first.subCourtId === second.subCourtId &&
          first.date === second.date &&
          this.overlaps(
            first.startMinutes,
            first.endMinutes,
            second.startMinutes,
            second.endMinutes,
          )
        ) {
          throw new BadRequestException(
            'Các mục không được trùng khung giờ trên cùng một court',
          );
        }
      }
    }

    const uniqueDates = Array.from(
      new Set(parsedItems.map((item) => item.date)),
    );

    const existingItems = await this.bookingItemRepository
      .createQueryBuilder('item')
      .leftJoin('item.subCourt', 'subCourt')
      .leftJoin('item.booking', 'booking')
      .where('subCourt.id IN (:...subCourtIds)', {
        subCourtIds: uniqueSubCourtIds,
      })
      .andWhere('item.date IN (:...dates)', { dates: uniqueDates })
      .andWhere('booking.status NOT IN (:...cancelled)', {
        cancelled: [BookingStatus.CANCELLED, BookingStatus.REJECTED],
      })
      .select([
        'item.id',
        'item.subCourt',
        'item.date',
        'item.startTime',
        'item.endTime',
        'booking.status',
      ])
      .getMany();

    for (const parsed of parsedItems) {
      const conflicts = existingItems.filter(
        (existing) =>
          existing.subCourt.id === parsed.subCourtId &&
          existing.date === parsed.date &&
          this.overlaps(
            parsed.startMinutes,
            parsed.endMinutes,
            this.parseMinutes(existing.startTime),
            this.parseMinutes(existing.endTime),
          ),
      );
      if (conflicts.length > 0) {
        this.logger.warn(
          `booking conflict for subCourt=${parsed.subCourtId} date=${parsed.date}`,
        );
        throw new BadRequestException(
          'Một khung giờ bạn chọn đã bị đặt trước đó.',
        );
      }
    }

    const bookingItems = parsedItems.map((item) => ({
      date: item.date,
      startTime: item.startTime,
      endTime: item.endTime,
      price: item.price,
      subCourt: { id: item.subCourtId } as SubCourtEntity,
    }));

    const booking = this.bookingRepository.create({
      note: dto.note,
      totalPrice: dto.totalPrice,
      status: BookingStatus.PENDING,
      user: { id: numericUserId } as any,
      supperCourt: { id: supperCourtId } as any,
      items: bookingItems,
    });
    return this.bookingRepository.save(booking);
  }

  async uploadBill(
    userId: string,
    bookingId: string,
    dto: UploadBookingBillDto,
  ) {
    const numericUserId = Number(userId);
    const numericBookingId = Number(bookingId);

    if (Number.isNaN(numericUserId) || Number.isNaN(numericBookingId)) {
      throw new BadRequestException('userId hoặc bookingId không hợp lệ.');
    }

    const booking = await this.bookingRepository.findOne({
      relations: ['user', 'items'],
      where: { id: numericBookingId },
    });

    if (!booking || booking.user?.id !== numericUserId) {
      throw new NotFoundException('Booking không tồn tại.');
    }

    booking.imgBill = dto.imgBill;
    booking.status = BookingStatus.PENDING;

    await this.bookingRepository.save(booking);

    return this.bookingRepository.findOneOrFail({
      where: { id: numericBookingId },
      relations: ['items', 'supperCourt'],
    });
  }
}
