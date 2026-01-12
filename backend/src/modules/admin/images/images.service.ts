import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SupperCourtEntity } from '../../../database/entities/supper-court.entity';
import { ImageEntity } from '../../../database/entities/court-image.entity';
import { CreateImageDto } from './dto/create-image.dto';
import { ListImageQueryDto } from './dto/list-image-query.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { CreateOwnerImageDto } from './dto/create-owner-image.dto';
import { CourtImageType } from 'src/shared/enums/court.enum';
import { plainToInstance } from 'class-transformer';
import { ImageResponseDto } from './dto/image-response.dto';

@Injectable()
export class ImagesService {
  constructor(
    @InjectRepository(ImageEntity)
    private readonly imageRepository: Repository<ImageEntity>,
    @InjectRepository(SupperCourtEntity)
    private readonly courtRepository: Repository<SupperCourtEntity>,
  ) {}

  async listPublic(query: ListImageQueryDto) {
    const qb = this.baseQuery();
    this.applyListFilters(qb, query);
    const images = await qb
      .orderBy('image.priority', 'ASC')
      .addOrderBy('image.createdAt', 'DESC')
      .getMany();
    const data = plainToInstance(ImageResponseDto, images, {
      excludeExtraneousValues: true,
    });
    return {
      data: data,
      meta: {
        page: 1,
        limit: data.length,
        total: data.length,
      },
    };
  }

  async listForOwner(query: ListImageQueryDto, ownerId: string) {
    const qb = this.baseQuery();
    const courtId = this.applyListFilters(qb, query);
    if (courtId) {
      await this.ensureCourtBelongsToOwner(ownerId, `${courtId}`);
    } else {
      qb.andWhere('supperCourt.user_id = :ownerId', {
        ownerId: this.parseOwnerId(ownerId),
      });
    }

    const images = await qb
      .orderBy('image.priority', 'ASC')
      .addOrderBy('image.createdAt', 'DESC')
      .getMany();
    return plainToInstance(ImageResponseDto, images, {
      excludeExtraneousValues: true,
    });
  }

  private baseQuery() {
    return this.imageRepository
      .createQueryBuilder('image')
      .leftJoinAndSelect('image.supperCourt', 'supperCourt');
  }

  private applyListFilters(qb: any, query: ListImageQueryDto) {
    if (query.type) {
      qb.andWhere('image.type = :type', { type: query.type });
    }

    if (query.supperCourtId) {
      const courtId = this.parseNumber(query.supperCourtId, 'SupperCourtId');
      qb.andWhere('supperCourt.id = :courtId', { courtId });
      return courtId;
    }

    return null;
  }

  async findOne(id: string, ownerId?: string) {
    const image = await this.loadImageEntity(id, ownerId);
    return plainToInstance(ImageResponseDto, image, {
      excludeExtraneousValues: true,
    });
  }

  async create(dto: CreateImageDto, ownerId?: string) {
    const court = ownerId
      ? await this.resolveOwnerCourt(ownerId, dto.supperCourtId)
      : dto.supperCourtId
        ? await this.findCourt(dto.supperCourtId)
        : undefined;

    if (dto.type === CourtImageType.GALLERY) {
      if (!dto.galleryItems || dto.galleryItems.length === 0) {
        throw new BadRequestException('Gallery cần ít nhất một ảnh');
      }
    } else if (!dto.url) {
      throw new BadRequestException('Vui lòng cung cấp url cho ảnh');
    }

    const entries: ImageEntity[] = [];

    if (dto.type === CourtImageType.GALLERY) {
      const galleryItems = dto.galleryItems ?? [];
      galleryItems.forEach((item, index) => {
        entries.push(
          this.imageRepository.create({
            key: item.key ?? dto.key,
            url: item.url,
            type: dto.type,
            priority: item.priority ?? index + 1,
            supperCourt: court,
          }),
        );
      });
    } else {
      entries.push(
        this.imageRepository.create({
          key: dto.key,
          url: dto.url,
          type: dto.type,
          priority: dto.priority ?? 0,
          supperCourt: court,
        }),
      );
    }

    const saved = await this.imageRepository.save(entries);
    return plainToInstance(ImageResponseDto, saved, {
      excludeExtraneousValues: true,
    });
  }

  async createForOwner(dto: CreateOwnerImageDto, ownerId: string) {
    const court = await this.resolveOwnerCourt(ownerId, dto.supperCourtId);
    const priority = dto.priority ?? 0;
    const existing = await this.imageRepository.findOne({
      where: {
        priority,
        supperCourt: { id: court.id } as any,
      },
      relations: ['supperCourt'],
    });

    if (existing) {
      if (dto.key !== undefined) {
        existing.key = dto.key;
      }
      existing.url = dto.url;
      existing.type = dto.type;
      existing.priority = priority;
      const updated = await this.imageRepository.save(existing);
      return plainToInstance(ImageResponseDto, updated, {
        excludeExtraneousValues: true,
      });
    }
    const entry = this.imageRepository.create({
      key: dto.key,
      url: dto.url,
      type: dto.type,
      priority,
      supperCourt: court,
    });
    const saved = await this.imageRepository.save(entry);
    return plainToInstance(ImageResponseDto, saved, {
      excludeExtraneousValues: true,
    });
  }

  async update(id: string, dto: UpdateImageDto, ownerId?: string) {
    const image = await this.loadImageEntity(id, ownerId);

    if (dto.key !== undefined) {
      image.key = dto.key;
    }
    if (dto.url !== undefined) {
      image.url = dto.url;
    }
    if (dto.priority !== undefined) {
      image.priority = dto.priority;
    }
    if (dto.supperCourtId !== undefined) {
      if (ownerId) {
        image.supperCourt = await this.ensureCourtBelongsToOwner(
          ownerId,
          dto.supperCourtId,
        );
      } else {
        image.supperCourt = await this.findCourt(dto.supperCourtId);
      }
    }

    const updated = await this.imageRepository.save(image);
    return plainToInstance(ImageResponseDto, updated, {
      excludeExtraneousValues: true,
    });
  }

  async remove(id: string, ownerId?: string) {
    const image = await this.loadImageEntity(id, ownerId);
    await this.imageRepository.remove(image);
    return { success: true };
  }

  private async loadImageEntity(id: string, ownerId?: string) {
    const numericId = Number(id);
    if (Number.isNaN(numericId)) {
      throw new BadRequestException('Id không hợp lệ');
    }

    const image = await this.imageRepository.findOne({
      where: { id: numericId },
      relations: ['supperCourt', 'supperCourt.user'],
    });

    if (!image) {
      throw new NotFoundException('Ảnh không tồn tại');
    }

    if (ownerId) {
      this.assertImageBelongsToOwner(image, ownerId);
    }
    return image;
  }

  private async findCourt(id: string) {
    const numericId = this.parseNumber(id, 'SupperCourtId');

    const court = await this.courtRepository.findOne({
      where: { id: numericId },
    });

    if (!court) {
      throw new NotFoundException('Supper court không tồn tại');
    }

    return court;
  }

  private parseNumber(value: string, label: string): number {
    const numeric = Number(value);
    if (Number.isNaN(numeric)) {
      throw new BadRequestException(`${label} không hợp lệ`);
    }
    return numeric;
  }

  private parseOwnerId(ownerId: string): number {
    return this.parseNumber(ownerId, 'OwnerId');
  }

  private assertImageBelongsToOwner(image: ImageEntity, ownerId: string) {
    const ownerNumericId = this.parseOwnerId(ownerId);
    const ownerFromImage = image.supperCourt?.user?.id;
    if (!ownerFromImage || Number(ownerFromImage) !== ownerNumericId) {
      throw new NotFoundException('Ảnh không thuộc sân của bạn');
    }
  }

  private async ensureCourtBelongsToOwner(
    ownerId: string,
    courtId: string,
  ): Promise<SupperCourtEntity> {
    const numericCourtId = this.parseNumber(courtId, 'SupperCourtId');
    const numericOwnerId = this.parseOwnerId(ownerId);
    const court = await this.courtRepository.findOne({
      where: { id: numericCourtId },
      relations: ['user'],
    });
    if (!court || !court.user || Number(court.user.id) !== numericOwnerId) {
      throw new NotFoundException('Supper court không thuộc quyền của bạn');
    }
    return court;
  }

  private async findAnyCourtForOwner(
    ownerId: string,
  ): Promise<SupperCourtEntity> {
    const numericOwnerId = this.parseOwnerId(ownerId);
    const court = await this.courtRepository.findOne({
      where: { user: { id: numericOwnerId } as any },
    });
    if (!court) {
      throw new NotFoundException('Bạn chưa có cụm sân nào');
    }
    return court;
  }

  private async resolveOwnerCourt(
    ownerId: string,
    courtId?: string,
  ): Promise<SupperCourtEntity> {
    if (courtId) {
      return this.ensureCourtBelongsToOwner(ownerId, courtId);
    }
    return this.findAnyCourtForOwner(ownerId);
  }
}
