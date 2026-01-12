import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { BookingStatus } from '../../../shared/enums/booking.enum';
import { SubCourtEntity } from '../../../database/entities/sub-court.entity';
import { CreateBookingDto } from '../../booking/dto/create-booking.dto';
import { BookingService } from '../../booking/booking.service';

@Injectable()
export class LockCourtService {

  constructor(
    private readonly bookingService: BookingService,
    @InjectRepository(SubCourtEntity)
    private readonly subCourtRepository: Repository<SubCourtEntity>,
  ) {}

  async lockCourt(ownerId: string, dto: CreateBookingDto) {
    const numericOwnerId = Number(ownerId);
    if (Number.isNaN(numericOwnerId)) {
      throw new BadRequestException('ownerId không hợp lệ');
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
      relations: ['supperCourt', 'supperCourt.user'],
    });

    if (subCourts.length !== uniqueSubCourtIds.length) {
      throw new NotFoundException('Một hoặc nhiều court không tồn tại.');
    }

    for (const subCourt of subCourts) {
      if (!subCourt.supperCourt || !subCourt.supperCourt.user) {
        throw new BadRequestException(
          'Court chưa được ghép owner hoặc supper court.',
        );
      }
      if (Number(subCourt.supperCourt.user.id) !== numericOwnerId) {
        throw new BadRequestException(
          'Bạn chỉ được khóa các court thuộc cụm sân của mình.',
        );
      }
    }

    return this.bookingService.createBooking(
      ownerId,
      dto,
      BookingStatus.OUT_OF_SYSTEM,
    );
  }
}
