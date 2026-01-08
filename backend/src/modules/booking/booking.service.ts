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
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';
import { ListBookingResponseDto } from './dto/list-booking-query.dto';
import { plainToInstance } from 'class-transformer';

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
      .leftJoinAndSelect('item.subCourt', 'subCourt')
      .leftJoin('item.booking', 'booking')
      .where('subCourt.id IN (:...subCourtIds)', {
        subCourtIds: uniqueSubCourtIds,
      })
      .andWhere('item.date IN (:...dates)', { dates: uniqueDates })
      .andWhere('booking.status NOT IN (:...cancelled)', {
        cancelled: [BookingStatus.CANCELLED, BookingStatus.REJECTED],
      })
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
      expiredAt: new Date(Date.now() + 7 * 60 * 1000),
      items: bookingItems,
    });
    const saved = await this.bookingRepository.save(booking);
    const fresh = await this.bookingRepository.findOneOrFail({
      where: { id: saved.id },
      relations: ['items', 'items.subCourt', 'supperCourt', 'user'],
    });

    return {
      id: fresh.id,
      note: fresh.note,
      totalPrice: fresh.totalPrice,
      status: fresh.status,
      expiredAt: fresh.expiredAt,
      createdAt: fresh.createdAt,
      updatedAt: fresh.updatedAt,
      items: fresh.items,
      supperCourt: fresh.supperCourt,
    };
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
    console.log(booking?.user?.id, numericUserId);

    if (!booking || Number(booking.user?.id) !== numericUserId) {
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

  async listByUser(userId: string) {
    return this.bookingRepository.find({
      where: { user: { id: Number(userId) } as any },
      relations: ['items', 'supperCourt', 'user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOneForUser(userId: string, bookingId: string) {
    const numericUserId = Number(userId);
    const numericBookingId = Number(bookingId);
    if (Number.isNaN(numericBookingId)) {
      throw new BadRequestException('bookingId không hợp lệ');
    }
    const booking = await this.bookingRepository.findOne({
      where: { id: numericBookingId, user: { id: numericUserId } as any },
      relations: ['items', 'items.subCourt', 'supperCourt', 'user'],
    });

    if (!booking) {
      throw new NotFoundException('Booking không tồn tại');
    }
    return booking;
  }

  async cancelByUser(userId: string, bookingId: string) {
    const booking = await this.findOneForUser(userId, bookingId);
    booking.status = BookingStatus.CANCELLED;
    return this.bookingRepository.save(booking);
  }

  async listByOwner(ownerId: string, date?: string) {
    const queryBuilder = this.bookingRepository
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.supperCourt', 'supperCourt')
      .leftJoinAndSelect('booking.items', 'items')
      .leftJoinAndSelect('items.subCourt', 'subCourt')
      .leftJoinAndSelect('booking.user', 'user')
      .leftJoin('supperCourt.user', 'owner')
      .where('owner.id = :ownerId', { ownerId: Number(ownerId) });

    if (date) {
      const normalizedDate = date.trim();
      if (!/^\d{4}-\d{2}-\d{2}$/.test(normalizedDate)) {
        throw new BadRequestException(
          'Ngày không hợp lệ, định dạng YYYY-MM-DD (ví dụ: 2026-01-15)',
        );
      }
      // Filter items theo date và chỉ lấy booking có ít nhất một item với date đó
      queryBuilder.andWhere('items.date = :date', { date: normalizedDate });
      queryBuilder.distinct(true);
    }

    const data = await queryBuilder.orderBy('booking.createdAt', 'DESC').getMany();
    return plainToInstance(ListBookingResponseDto, data, { excludeExtraneousValues: true });
  }

  private async ensureOwnerAccess(ownerId: string, bookingId: string) {
    const numericBookingId = Number(bookingId);
    const booking = await this.bookingRepository
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.supperCourt', 'supperCourt')
      .leftJoin('supperCourt.user', 'owner')
      .where('booking.id = :id', { id: numericBookingId })
      .andWhere('owner.id = :ownerId', { ownerId: Number(ownerId) })
      .getOne();

    if (!booking) {
      throw new NotFoundException(
        'Booking không tồn tại hoặc không thuộc sân của bạn',
      );
    }
    return booking;
  }

  async findOneForOwner(ownerId: string, bookingId: string) {
    const numericBookingId = Number(bookingId);
    if (Number.isNaN(numericBookingId)) {
      throw new BadRequestException('bookingId không hợp lệ');
    }

    const booking = await this.bookingRepository
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.supperCourt', 'supperCourt')
      .leftJoinAndSelect('booking.items', 'items')
      .leftJoinAndSelect('items.subCourt', 'subCourt')
      .leftJoinAndSelect('booking.user', 'user')
      .leftJoin('supperCourt.user', 'owner')
      .where('booking.id = :id', { id: numericBookingId })
      .andWhere('owner.id = :ownerId', { ownerId: Number(ownerId) })
      .getOne();

    if (!booking) {
      throw new NotFoundException(
        'Booking không tồn tại hoặc không thuộc sân của bạn',
      );
    }

    return booking;
  }

  async updateStatusByOwner(
    ownerId: string,
    bookingId: string,
    dto: UpdateBookingStatusDto,
  ) {
    const booking = await this.ensureOwnerAccess(ownerId, bookingId);
    booking.status = dto.status;
    return this.bookingRepository.save(booking);
  }

  async listAllForAdmin(date?: string) {
    const queryBuilder = this.bookingRepository
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.items', 'items')
      .leftJoinAndSelect('items.subCourt', 'subCourt')
      .leftJoinAndSelect('booking.supperCourt', 'supperCourt')
      .leftJoinAndSelect('booking.user', 'user');

    // Nếu có filter theo ngày, chỉ lấy booking có items với date đó
    if (date) {
      const normalizedDate = date.trim();
      if (!/^\d{4}-\d{2}-\d{2}$/.test(normalizedDate)) {
        throw new BadRequestException(
          'Ngày không hợp lệ, định dạng YYYY-MM-DD (ví dụ: 2026-01-15)',
        );
      }
      queryBuilder.where('items.date = :date', { date: normalizedDate });
      queryBuilder.distinct(true);
    }

    return queryBuilder.orderBy('booking.createdAt', 'DESC').getMany();
  }

  async getById(bookingId: string) {
    const numericBookingId = Number(bookingId);
    if (Number.isNaN(numericBookingId)) {
      throw new BadRequestException('bookingId không hợp lệ');
    }
    const booking = await this.bookingRepository.findOne({
      where: { id: numericBookingId },
      relations: ['items', 'items.subCourt', 'supperCourt', 'user'],
    });
    if (!booking) {
      throw new NotFoundException('Booking không tồn tại');
    }
    return booking;
  }

  async deleteForAdmin(bookingId: string) {
    const booking = await this.getById(bookingId);
    await this.bookingRepository.remove(booking);
    return { success: true };
  }
}
