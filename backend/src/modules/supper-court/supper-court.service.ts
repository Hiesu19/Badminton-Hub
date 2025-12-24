import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { SupperCourtEntity } from '../../database/entities/supper-court.entity';
import { PublicSupperCourtPaginationDto } from './dto/public-supper-court-pagination.dto';
import { SupperCourtStatus } from 'src/shared/enums/supper-court.enum';

@Injectable()
export class SupperCourtService {
  constructor(
    @InjectRepository(SupperCourtEntity)
    private readonly supperCourtRepository: Repository<SupperCourtEntity>,
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
    });

    if (!supperCourt) {
      throw new NotFoundException('Sân không tồn tại hoặc chưa được duyệt');
    }

    return supperCourt;
  }
}
