import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubCourtEntity } from '../../../database/entities/sub-court.entity';
import { SupperCourtEntity } from '../../../database/entities/supper-court.entity';
import { CreateOwnerSubCourtDto } from './dto/create-owner-sub-court.dto';
import { UpdateOwnerSubCourtDto } from './dto/update-owner-sub-court.dto';

@Injectable()
export class OwnerSubCourtService {
  constructor(
    @InjectRepository(SubCourtEntity)
    private readonly subCourtRepository: Repository<SubCourtEntity>,
    @InjectRepository(SupperCourtEntity)
    private readonly supperCourtRepository: Repository<SupperCourtEntity>,
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

  async listSubCourts(ownerId: string) {
    const court = await this.getMyCourtOrThrow(ownerId);
    return this.subCourtRepository.find({
      where: { supperCourt: { id: court.id } as any },
      order: { id: 'ASC' },
    });
  }

  async createSubCourt(ownerId: string, dto: CreateOwnerSubCourtDto) {
    const court = await this.getMyCourtOrThrow(ownerId);

    const sub = this.subCourtRepository.create({
      name: dto.name,
      supperCourt: { id: court.id } as any,
    });
    return this.subCourtRepository.save(sub);
  }

  async updateSubCourt(
    ownerId: string,
    subCourtId: string,
    dto: UpdateOwnerSubCourtDto,
  ) {
    if (!dto || Object.keys(dto).length === 0) {
      throw new BadRequestException('Không có dữ liệu để cập nhật');
    }

    const court = await this.getMyCourtOrThrow(ownerId);
    const numericSubId = Number(subCourtId);
    if (Number.isNaN(numericSubId)) {
      throw new BadRequestException('Id sân con không hợp lệ');
    }

    const sub = await this.subCourtRepository.findOne({
      where: { id: numericSubId, supperCourt: { id: court.id } as any },
    });
    if (!sub) {
      throw new NotFoundException('Sân con không tồn tại');
    }

    if (dto.name !== undefined) sub.name = dto.name;
    if (dto.isActive !== undefined) sub.isActive = dto.isActive;

    return this.subCourtRepository.save(sub);
  }

  async deleteSubCourt(ownerId: string, subCourtId: string) {
    const court = await this.getMyCourtOrThrow(ownerId);
    const numericSubId = Number(subCourtId);
    if (Number.isNaN(numericSubId)) {
      throw new BadRequestException('Id sân con không hợp lệ');
    }

    const sub = await this.subCourtRepository.findOne({
      where: { id: numericSubId, supperCourt: { id: court.id } as any },
    });
    if (!sub) {
      throw new NotFoundException('Sân con không tồn tại');
    }

    await this.subCourtRepository.remove(sub);
    return 'Xóa sân con thành công';
  }
}
