import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { BookingItemEntity } from '../../database/entities/booking-item.entity';
import { SupperCourtEntity } from '../../database/entities/supper-court.entity';
import { SupperCourtPriceEntity } from '../../database/entities/price-court.entity';
import { PublicSupperCourtPaginationDto } from './dto/public-supper-court-pagination.dto';
import { PublicSupperCourtPriceMatrixSlotDto } from './dto/public-supper-court-price-matrix.dto';
import { SupperCourtStatus } from 'src/shared/enums/supper-court.enum';
import { BookingStatus } from 'src/shared/enums/booking.enum';
import {
  PublicSupperCourtBookingMatrixResponseDto,
  PublicSupperCourtBookingMatrixSlotDto,
  PublicSupperCourtBookingMatrixSubCourtDto,
} from './dto/public-supper-court-calendar.dto';
import { SubCourtEntity } from '../../database/entities/sub-court.entity';

const getSlotTime = (slotIndex: number) => {
  const boundedIndex = Math.min(slotIndex, 48);
  const minutes = boundedIndex * 30;
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(remainder).padStart(2, '0')}`;
};

@Injectable()
export class SupperCourtService {
  constructor(
    @InjectRepository(SupperCourtEntity)
    private readonly supperCourtRepository: Repository<SupperCourtEntity>,
    @InjectRepository(BookingItemEntity)
    private readonly bookingItemRepository: Repository<BookingItemEntity>,
    @InjectRepository(SupperCourtPriceEntity)
    private readonly priceRepository: Repository<SupperCourtPriceEntity>,
    @InjectRepository(SubCourtEntity)
    private readonly subCourtRepository: Repository<SubCourtEntity>,
  ) {}

  async findAllPublic(pagination: PublicSupperCourtPaginationDto) {
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 10;

    const where: any = {
      status: SupperCourtStatus.ACTIVE,
    };

    if (pagination.search) {
      where.name = Like(`%${pagination.search}%`);
    }

    if (pagination.isAll) {
      const items = await this.supperCourtRepository.find({
        where,
        order: { id: 'DESC' },
      });

      return {
        data: items,
        meta: {
          page: 1,
          limit: items.length || limit,
          total: items.length,
        },
      };
    }

    const [items, total] = await this.supperCourtRepository.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: { id: 'DESC' },
    });

    return {
      data: items,
      meta: { page, limit, total },
    };
  }

  async findOnePublic(id: string) {
    const numericId = Number(id);
    if (Number.isNaN(numericId)) {
      throw new BadRequestException('Id sân không hợp lệ');
    }

    const supperCourt = await this.supperCourtRepository.findOne({
      where: { id: numericId, status: SupperCourtStatus.ACTIVE },
      relations: ['user', 'images'],
    });

    if (!supperCourt) {
      throw new NotFoundException('Sân không tồn tại hoặc chưa được duyệt');
    }

    return supperCourt;
  }

  async getCalendar(
    id: string,
    date: string,
    isPublic = true,
  ): Promise<PublicSupperCourtBookingMatrixResponseDto> {
    const numericId = Number(id);
    if (Number.isNaN(numericId)) {
      throw new BadRequestException('Id sân không hợp lệ');
    }

    const normalizedDate = date?.trim();
    if (!normalizedDate || !/^\d{4}-\d{2}-\d{2}$/.test(normalizedDate)) {
      throw new BadRequestException('Ngày không hợp lệ (YYYY-MM-DD).');
    }

    const parsed = new Date(normalizedDate);
    if (Number.isNaN(parsed.getTime())) {
      throw new BadRequestException('Ngày không hợp lệ.');
    }

    parsed.setHours(0, 0, 0, 0);

    if (isPublic) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (parsed < today) {
        throw new BadRequestException('Không thể xem lịch ngày quá khứ.');
      }
    }

    const supperCourt = await this.supperCourtRepository.findOne({
      where: { id: numericId, status: SupperCourtStatus.ACTIVE },
    });

    if (!supperCourt) {
      throw new NotFoundException('Sân không tồn tại hoặc chưa được duyệt');
    }

    const subCourts = await this.subCourtRepository.find({
      where: { supperCourt: { id: numericId } as any },
      order: { id: 'ASC' },
    });

    const bookingItems = await this.bookingItemRepository
      .createQueryBuilder('item')
      .leftJoinAndSelect('item.subCourt', 'subCourt')
      .leftJoinAndSelect('item.booking', 'booking')
      .leftJoin('subCourt.supperCourt', 'supperCourt')
      .where('supperCourt.id = :supperCourtId', { supperCourtId: numericId })
      .andWhere('item.date = :date', { date: normalizedDate })
      .andWhere('booking.status NOT IN (:...cancelled)', {
        cancelled: [BookingStatus.CANCELLED, BookingStatus.REJECTED],
      })
      .andWhere(
        '(booking.status != :pending OR booking.imgBill IS NOT NULL OR booking.expiredAt > :now)',
        {
          pending: BookingStatus.PENDING,
          now: new Date(),
        },
      )
      .orderBy('subCourt.id', 'ASC')
      .addOrderBy('item.startTime', 'ASC')
      .getMany();

    const slotTemplate = (): PublicSupperCourtBookingMatrixSlotDto[] => {
      const slots: PublicSupperCourtBookingMatrixSlotDto[] = [];
      for (let slotIndex = 0; slotIndex < 48; slotIndex += 1) {
        const startTime = getSlotTime(slotIndex);
        const endTime = getSlotTime(slotIndex + 1);
        slots.push({
          startTime,
          endTime,
          bookingId: null,
          status: null,
          price: null,
        });
      }
      return slots;
    };

    const matrix = new Map<number, PublicSupperCourtBookingMatrixSlotDto[]>();
    for (const subCourt of subCourts) {
      matrix.set(subCourt.id, slotTemplate());
    }

    const timeToSlotIndex = (time: string) => {
      const [hours, minutes] = time
        .slice(0, 5)
        .split(':')
        .map((value) => Number(value));
      const index = hours * 2 + (minutes >= 30 ? 1 : 0);
      return Math.min(Math.max(index, 0), 48);
    };

    const populateSlot = (
      subCourtId: number,
      booking: BookingItemEntity,
    ): void => {
      const slots = matrix.get(subCourtId);
      if (!slots) return;

      const startSlot = timeToSlotIndex(booking.startTime);
      const endSlot = timeToSlotIndex(booking.endTime);

      for (let pointer = startSlot; pointer < endSlot; pointer += 1) {
        if (pointer >= slots.length) break;
        const slot = slots[pointer];
        slot.bookingId = booking.booking.id;
        slot.status = booking.booking.status;
        slot.price = booking.price;
      }
    };

    for (const item of bookingItems) {
      populateSlot(item.subCourt.id, item);
    }

    const responseSubCourts: PublicSupperCourtBookingMatrixSubCourtDto[] =
      subCourts.map((subCourt) => {
        const slots = matrix.get(subCourt.id) ?? slotTemplate();
        return {
          subCourtId: subCourt.id,
          subCourtName: subCourt.name,
          map: slots.filter((slot) => slot.status !== null),
        };
      });

    return {
      date: normalizedDate,
      subCourts: responseSubCourts,
    };
  }

  async getSubCourtsPublic(id: string) {
    const numericId = Number(id);
    if (Number.isNaN(numericId)) {
      throw new BadRequestException('Id sân không hợp lệ');
    }

    const supperCourt = await this.supperCourtRepository.findOne({
      where: { id: numericId, status: SupperCourtStatus.ACTIVE },
    });

    if (!supperCourt) {
      throw new NotFoundException('Sân không tồn tại hoặc chưa được duyệt');
    }

    return this.subCourtRepository.find({
      where: { supperCourt: { id: numericId } as any },
      order: { id: 'ASC' },
    });
  }

  async getPriceMatrix(
    id: string,
  ): Promise<Record<number, PublicSupperCourtPriceMatrixSlotDto[]>> {
    const numericId = Number(id);
    if (Number.isNaN(numericId)) {
      throw new BadRequestException('Id sân không hợp lệ');
    }

    const supperCourt = await this.supperCourtRepository.findOne({
      where: { id: numericId, status: SupperCourtStatus.ACTIVE },
    });

    if (!supperCourt) {
      throw new NotFoundException('Sân không tồn tại hoặc chưa được duyệt');
    }

    const priceRows = await this.priceRepository.find({
      where: { supperCourt: { id: numericId } as any },
      order: { dayOfWeek: 'ASC', startTime: 'ASC' },
    });

    const slotMatrix: Record<number, PublicSupperCourtPriceMatrixSlotDto[]> =
      {};
    const priceLookup = new Map<string, PublicSupperCourtPriceMatrixSlotDto>();
    for (const row of priceRows) {
      if (row.dayOfWeek === null) continue;
      const key = `${row.dayOfWeek}-${row.startTime.slice(0, 5)}`;
      priceLookup.set(key, {
        priceId: row.id,
        price: row.pricePerHour,
        startTime: row.startTime.slice(0, 5),
        endTime: row.endTime.slice(0, 5),
      });
    }

    const getSlotStartTime = (slotIndex: number) => {
      const minutes = slotIndex * 30;
      const hours = Math.floor(minutes / 60);
      const minutesOfHour = minutes % 60;
      return `${String(hours).padStart(2, '0')}:${String(
        minutesOfHour,
      ).padStart(2, '0')}`;
    };

    const getSlotEndTime = (startTime: string) => {
      const [hour, minute] = startTime.split(':').map((part) => Number(part));
      let totalMinutes = hour * 60 + minute + 30;
      if (totalMinutes > 24 * 60) {
        totalMinutes = 24 * 60;
      }
      const endHour = Math.floor(totalMinutes / 60);
      const endMinute = totalMinutes % 60;
      return `${String(endHour).padStart(2, '0')}:${String(endMinute).padStart(
        2,
        '0',
      )}`;
    };

    for (let day = 0; day < 7; day += 1) {
      const slots: PublicSupperCourtPriceMatrixSlotDto[] = [];
      for (let slotIndex = 0; slotIndex < 48; slotIndex += 1) {
        const startTime = getSlotStartTime(slotIndex);
        const key = `${day}-${startTime}`;
        const row = priceLookup.get(key);
        slots.push(
          row ?? {
            priceId: null,
            price: null,
            startTime,
            endTime: getSlotEndTime(startTime),
          },
        );
      }
      slotMatrix[day] = slots;
    }

    return slotMatrix;
  }
}
