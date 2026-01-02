import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SupperCourtEntity } from '../../../database/entities/supper-court.entity';
import { SupperCourtPriceEntity } from '../../../database/entities/price-court.entity';
import { UpdateOwnerSupperCourtDto } from './dto/update-owner-supper-court.dto';
import { CreateOwnerPriceDto } from './dto/create-owner-price.dto';
import { UpdateOwnerPriceDto } from './dto/update-owner-price.dto';

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

  // ---------- Bảng giá ----------

  async listPrices(ownerId: string) {
    const court = await this.getMyCourtOrThrow(ownerId);
    return this.priceRepository.find({
      where: { supperCourt: { id: court.id } as any },
      order: { dayOfWeek: 'ASC', startTime: 'ASC' },
    });
  }

  async createPrice(ownerId: string, dto: CreateOwnerPriceDto) {
    const court = await this.getMyCourtOrThrow(ownerId);

    const price = this.priceRepository.create({
      ...dto,
      supperCourt: { id: court.id } as any,
    });
    return this.priceRepository.save(price);
  }

  async updatePrice(
    ownerId: string,
    priceId: string,
    dto: UpdateOwnerPriceDto,
  ) {
    if (!dto || Object.keys(dto).length === 0) {
      throw new BadRequestException('Không có dữ liệu để cập nhật');
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

    Object.assign(price, dto);
    return this.priceRepository.save(price);
  }

  async deletePrice(ownerId: string, priceId: string) {
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

    await this.priceRepository.remove(price);
    return 'Xóa bảng giá thành công';
  }
}
