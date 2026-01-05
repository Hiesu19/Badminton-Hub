import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { SupperCourtEntity } from '../../../database/entities/supper-court.entity';
import { SupperCourtPriceEntity } from '../../../database/entities/price-court.entity';
import { CreateSupperCourtDto } from './dto/create-supper-court.dto';
import { UpdateSupperCourtDto } from './dto/update-supper-court.dto';
import { SupperCourtPaginationDto } from './dto/pagination-supper-court.dto';

@Injectable()
export class SupperCourtService {
  constructor(
    @InjectRepository(SupperCourtEntity)
    private readonly supperCourtRepository: Repository<SupperCourtEntity>,
    @InjectRepository(SupperCourtPriceEntity)
    private readonly priceRepository: Repository<SupperCourtPriceEntity>,
  ) {}

  async create(ownerId: string, dto: CreateSupperCourtDto) {
    const numericOwnerId = Number(ownerId);
    if (Number.isNaN(numericOwnerId)) {
      throw new BadRequestException('userId không hợp lệ');
    }

    const existedCourt = await this.supperCourtRepository.findOne({
      where: { user: { id: numericOwnerId } as any },
    });
    if (existedCourt) {
      throw new BadRequestException('Mỗi chủ sân chỉ được tạo một cụm sân');
    }

    const supperCourt = this.supperCourtRepository.create({
      ...dto,
      user: { id: numericOwnerId } as any,
    });

    await this.supperCourtRepository.save(supperCourt);
    await this.priceRepository.save(
      this.generateWeeklyPriceGrid(supperCourt.id),
    );

    return supperCourt;
  }

  private generateWeeklyPriceGrid(supperCourtId: number) {
    const blocks: Partial<SupperCourtPriceEntity>[] = [];

    const formatTime = (minutes: number) => {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${String(hours).padStart(2, '0')}:${String(mins).padStart(
        2,
        '0',
      )}:00`;
    };

    for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek += 1) {
      for (let slot = 0; slot < 48; slot += 1) {
        const startMinutes = slot * 30;
        const endMinutes = (slot + 1) * 30;

        blocks.push({
          dayOfWeek,
          startTime: formatTime(startMinutes),
          endTime: formatTime(endMinutes),
          pricePerHour: 10000000, // 10.000.000 VNĐ / giờ :)
          supperCourt: { id: supperCourtId } as any,
        });
      }
    }

    return blocks;
  }

  async findAll(pagination: SupperCourtPaginationDto) {
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 10;

    const where: any = {};

    if (pagination.search) {
      where.name = Like(`%${pagination.search}%`);
    }

    if (pagination.status) {
      where.status = pagination.status;
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

  async findOne(id: string) {
    const numericId = Number(id);
    if (Number.isNaN(numericId)) {
      throw new BadRequestException('Id sân không hợp lệ');
    }

    const supperCourt = await this.supperCourtRepository.findOne({
      where: { id: numericId },
    });

    if (!supperCourt) {
      throw new NotFoundException('Sân không tồn tại');
    }

    return supperCourt;
  }

  async update(id: string, dto: UpdateSupperCourtDto) {
    if (!dto || Object.keys(dto).length === 0) {
      throw new BadRequestException('Không có dữ liệu để cập nhật');
    }

    const numericId = Number(id);
    if (Number.isNaN(numericId)) {
      throw new BadRequestException('Id sân không hợp lệ');
    }

    const supperCourt = await this.supperCourtRepository.findOne({
      where: { id: numericId },
    });

    if (!supperCourt) {
      throw new NotFoundException('Sân không tồn tại');
    }

    Object.assign(supperCourt, dto);

    await this.supperCourtRepository.save(supperCourt);

    return supperCourt;
  }

  async remove(id: string) {
    const numericId = Number(id);
    if (Number.isNaN(numericId)) {
      throw new BadRequestException('Id sân không hợp lệ');
    }

    const supperCourt = await this.supperCourtRepository.findOne({
      where: { id: numericId },
    });

    if (!supperCourt) {
      throw new NotFoundException('Sân không tồn tại');
    }

    await this.supperCourtRepository.remove(supperCourt);

    return 'Xóa sân thành công';
  }
}
