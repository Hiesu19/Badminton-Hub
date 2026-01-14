import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { SupperCourtEntity } from '../../../database/entities/supper-court.entity';
import { SupperCourtPriceEntity } from '../../../database/entities/price-court.entity';
import { UpdateOwnerSupperCourtDto } from './dto/update-owner-supper-court.dto';
import { UpdateOwnerPriceDto } from './dto/update-owner-price.dto';
import { DeviceKeyResponseDto } from './dto/device-key-response.dto';
import { randomBytes } from 'crypto';

@Injectable()
export class OwnerSupperCourtService {
  constructor(
    @InjectRepository(SupperCourtEntity)
    private readonly supperCourtRepository: Repository<SupperCourtEntity>,
    @InjectRepository(SupperCourtPriceEntity)
    private readonly priceRepository: Repository<SupperCourtPriceEntity>,
  ) {}

  private async getMyCourtOrThrow(ownerId: string) {
    const numericOwnerId = Number(ownerId);
    if (Number.isNaN(numericOwnerId)) {
      throw new BadRequestException('userId không hợp lệ');
    }

    const court = await this.supperCourtRepository.findOne({
      where: { user: { id: numericOwnerId } as any },
    });
    if (!court) {
      throw new NotFoundException('Bạn chưa có cụm sân nào');
    }
    return court;
  }

  async getMySupperCourt(ownerId: string) {
    return this.getMyCourtOrThrow(ownerId);
  }

  async updateMySupperCourt(ownerId: string, dto: UpdateOwnerSupperCourtDto) {
    if (!dto || Object.keys(dto).length === 0) {
      throw new BadRequestException('Không có dữ liệu để cập nhật');
    }

    const court = await this.getMyCourtOrThrow(ownerId);

    // Không cho cập nhật địa chỉ, address_link
    const {
      name,
      description,
      phone,
      email,
      website,
      imageUrl,
      bankName,
      bankAccountNumber,
      latitude,
      longitude,
    } = dto;

    if (name !== undefined) court.name = name;
    if (description !== undefined) court.description = description;
    if (phone !== undefined) court.phone = phone;
    if (email !== undefined) court.email = email;
    if (website !== undefined) court.website = website;
    if (imageUrl !== undefined) court.imageUrl = imageUrl;
    if (bankName !== undefined) court.bankName = bankName;
    if (bankAccountNumber !== undefined)
      court.bankAccountNumber = bankAccountNumber;
    if (latitude !== undefined) court.latitude = latitude;
    if (longitude !== undefined) court.longitude = longitude;

    await this.supperCourtRepository.save(court);

    return court;
  }

  private async findCourtWithSubCourts(ownerId: string) {
    const court = await this.supperCourtRepository.findOne({
      where: { user: { id: Number(ownerId) } as any },
      relations: ['subCourts'],
    });
    if (!court) {
      throw new NotFoundException('Bạn chưa có cụm sân nào');
    }
    return court;
  }

  async getDeviceKey(ownerId: string): Promise<DeviceKeyResponseDto> {
    const court = await this.findCourtWithSubCourts(ownerId);
    return {
      deviceKey: court.deviceKey ?? null,
      supperCourtId: court.id,
      subCourts:
        court.subCourts?.map((sub) => ({ id: sub.id, name: sub.name })) ?? [],
    };
  }

  async regenerateDeviceKey(ownerId: string): Promise<DeviceKeyResponseDto> {
    const court = await this.findCourtWithSubCourts(ownerId);
    const key = randomBytes(8).toString('hex');
    court.deviceKey = key;
    await this.supperCourtRepository.save(court);
    return {
      deviceKey: key,
      supperCourtId: court.id,
      subCourts:
        court.subCourts?.map((sub) => ({ id: sub.id, name: sub.name })) ?? [],
    };
  }

  // ---------- Bảng giá ----------

  async listPrices(ownerId: string, dayOfWeek?: number) {
    const court = await this.getMyCourtOrThrow(ownerId);

    const whereCondition: any = {
      supperCourt: { id: court.id } as any,
    };

    // Nếu có dayOfWeek, filter theo thứ trong tuần
    if (dayOfWeek !== undefined) {
      if (dayOfWeek < 0 || dayOfWeek > 6) {
        throw new BadRequestException(
          'dayOfWeek phải từ 0 (Chủ nhật) đến 6 (Thứ 7)',
        );
      }
      whereCondition.dayOfWeek = dayOfWeek;
    }

    return this.priceRepository.find({
      where: whereCondition,
      order: { dayOfWeek: 'ASC', startTime: 'ASC' },
    });
  }

  async updatePrice(
    ownerId: string,
    priceId: string,
    dto: UpdateOwnerPriceDto,
  ) {
    if (!dto || dto.pricePerHour === undefined) {
      throw new BadRequestException('Vui lòng cung cấp giá (pricePerHour)');
    }

    const court = await this.getMyCourtOrThrow(ownerId);
    const numericPriceId = Number(priceId);
    if (Number.isNaN(numericPriceId)) {
      throw new BadRequestException('Id bảng giá không hợp lệ');
    }

    const price = await this.priceRepository.findOne({
      where: {
        id: numericPriceId,
        supperCourt: { id: court.id } as any,
      },
    });

    if (!price) {
      throw new NotFoundException('Bảng giá không tồn tại');
    }

    // Chỉ cho phép cập nhật giá, không cho phép thay đổi khung giờ và thứ trong tuần
    // Vì các slot đã được cố định là 30 phút
    price.pricePerHour = dto.pricePerHour;

    return this.priceRepository.save(price);
  }

  async copyPrices(
    ownerId: string,
    dayOfWeekFrom: number,
    dayOfWeekTo: number,
  ) {
    // Validate dayOfWeek
    if (dayOfWeekFrom < 0 || dayOfWeekFrom > 6) {
      throw new BadRequestException(
        'dayOfWeekFrom phải từ 0 (Chủ nhật) đến 6 (Thứ 7)',
      );
    }
    if (dayOfWeekTo < 0 || dayOfWeekTo > 6) {
      throw new BadRequestException(
        'dayOfWeekTo phải từ 0 (Chủ nhật) đến 6 (Thứ 7)',
      );
    }
    if (dayOfWeekFrom === dayOfWeekTo) {
      throw new BadRequestException(
        'Không thể copy cấu hình giá sang chính nó',
      );
    }

    const court = await this.getMyCourtOrThrow(ownerId);

    // Lấy tất cả cấu hình giá của thứ nguồn
    const sourcePrices = await this.priceRepository.find({
      where: {
        supperCourt: { id: court.id } as any,
        dayOfWeek: dayOfWeekFrom,
      },
      order: { startTime: 'ASC' },
    });

    if (sourcePrices.length === 0) {
      throw new NotFoundException(
        `Không tìm thấy cấu hình giá cho thứ ${dayOfWeekFrom}`,
      );
    }

    // Xóa tất cả cấu hình giá cũ của thứ đích (nếu có)
    const existingTargetPrices = await this.priceRepository.find({
      where: {
        supperCourt: { id: court.id } as any,
        dayOfWeek: dayOfWeekTo,
      },
    });

    if (existingTargetPrices.length > 0) {
      await this.priceRepository.remove(existingTargetPrices);
    }

    // Tạo mới cấu hình giá cho thứ đích dựa trên thứ nguồn
    const newPrices = sourcePrices.map((sourcePrice) =>
      this.priceRepository.create({
        supperCourt: { id: court.id } as any,
        dayOfWeek: dayOfWeekTo,
        startTime: sourcePrice.startTime,
        endTime: sourcePrice.endTime,
        pricePerHour: sourcePrice.pricePerHour,
      }),
    );

    await this.priceRepository.save(newPrices);

    return {
      message: `Đã copy ${newPrices.length} cấu hình giá từ thứ ${dayOfWeekFrom} sang thứ ${dayOfWeekTo}`,
      count: newPrices.length,
    };
  }

  async bulkUpdatePrices(
    ownerId: string,
    dayOfWeek: number,
    startTime: string, // VD: "08:00"
    endTime: string, // VD: "14:00"
    pricePerHour: number,
  ) {
    // 1. Validation cơ bản
    if (dayOfWeek < 0 || dayOfWeek > 6) {
      throw new BadRequestException(
        'dayOfWeek phải từ 0 (Chủ nhật) đến 6 (Thứ 7)',
      );
    }
    if (pricePerHour === undefined || pricePerHour < 0) {
      throw new BadRequestException('pricePerHour phải là số không âm');
    }

    // Helper: Chuẩn hóa string thời gian sang định dạng HH:mm:ss để so sánh trong DB
    const normalizeTime = (timeStr: string) => {
      const trimmed = timeStr?.trim();
      if (!trimmed)
        throw new BadRequestException('Thời gian không được để trống');
      const parts = trimmed.split(':');
      if (parts.length < 2)
        throw new BadRequestException('Định dạng thời gian phải là HH:mm');

      const h = parts[0].padStart(2, '0');
      const m = parts[1].padStart(2, '0');
      const s = (parts[2] || '00').padStart(2, '0');

      // Kiểm tra tính hợp lệ của số
      if (isNaN(+h) || isNaN(+m) || isNaN(+s)) {
        throw new BadRequestException('Thời gian chứa ký tự không hợp lệ');
      }
      return `${h}:${m}:${s}`;
    };

    const isMidnightTarget = /^(24:00)(:00)?$/;
    const trimmedEndTime = endTime.trim();
    const isEndMidnight = isMidnightTarget.test(trimmedEndTime);

    const startFormatted = normalizeTime(startTime);
    const endFormatted = normalizeTime(endTime);

    if (startFormatted >= endFormatted) {
      throw new BadRequestException('Giờ kết thúc phải lớn hơn giờ bắt đầu');
    }

    // 2. Lấy thông tin sân
    const court = await this.getMyCourtOrThrow(ownerId);

    // 3. Lọc trực tiếp trong Database (Tăng hiệu năng & tránh lỗi parse JS)
    const whereCondition: any = {
      supperCourt: { id: court.id } as any,
      dayOfWeek,
      startTime: MoreThanOrEqual(startFormatted),
    };

    if (!isEndMidnight) {
      whereCondition.endTime = LessThanOrEqual(endFormatted);
    }

    const targets = await this.priceRepository.find({
      where: whereCondition,
      order: { startTime: 'ASC' },
    });

    if (!targets || targets.length === 0) {
      throw new NotFoundException(
        `Không tìm thấy slot nào trong khoảng ${startTime} - ${endTime} của thứ ${dayOfWeek}`,
      );
    }

    // 4. Cập nhật giá
    targets.forEach((p) => {
      p.pricePerHour = pricePerHour;
    });

    await this.priceRepository.save(targets);

    return {
      message: `Đã cập nhật giá cho ${targets.length} slot thành công`,
      count: targets.length,
      appliedRange: `${startFormatted} -> ${endFormatted}`,
    };
  }
}
