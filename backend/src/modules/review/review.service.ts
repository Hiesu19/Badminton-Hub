import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
import { SupperCourtEntity } from '../../database/entities/supper-court.entity';
import { ReviewEntity } from '../../database/entities/review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { ListReviewQueryDto } from './dto/list-review-query.dto';
import { ReviewResponseDto } from './dto/review-response.dto';
import { ReviewSummaryResponseDto } from './dto/review-summary-response.dto';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(ReviewEntity)
    private readonly reviewRepository: Repository<ReviewEntity>,
    @InjectRepository(SupperCourtEntity)
    private readonly supperCourtRepository: Repository<SupperCourtEntity>,
  ) {}

  async createReview(userId: string, dto: CreateReviewDto) {
    const numericUserId = Number(userId);
    const supperCourtId = Number(dto.supperCourtId);

    if (Number.isNaN(numericUserId) || Number.isNaN(supperCourtId)) {
      throw new BadRequestException(
        'Thông tin người dùng hoặc sân không hợp lệ.',
      );
    }

    const supperCourt = await this.supperCourtRepository.findOne({
      where: { id: supperCourtId },
    });
    if (!supperCourt) {
      throw new NotFoundException('Không tìm thấy cụm sân.');
    }

    const lastReview = await this.reviewRepository.findOne({
      where: {
        user: { id: numericUserId } as any,
        supperCourt: { id: supperCourtId } as any,
      },
      order: { createdAt: 'DESC' },
    });

    if (lastReview) {
      const sevenDays = 7 * 24 * 60 * 60 * 1000;
      const timeSince = Date.now() - lastReview.createdAt.getTime();
      if (timeSince < sevenDays) {
        throw new BadRequestException(
          'Bạn cần chờ ít nhất 7 ngày kể từ lần review gần nhất cho sân này.',
        );
      }
    }

    const review = this.reviewRepository.create({
      rating: dto.rating,
      comment: dto.comment ?? null,
      user: { id: numericUserId } as any,
      supperCourt: { id: supperCourtId } as any,
    });

    const saved = await this.reviewRepository.save(review);
    const fresh = await this.reviewRepository.findOneOrFail({
      where: { id: saved.id },
      relations: ['user', 'supperCourt'],
    });
    return plainToInstance(ReviewResponseDto, fresh, {
      excludeExtraneousValues: true,
    });
  }

  async deleteReview(userId: string, reviewId: string) {
    const numericUserId = Number(userId);
    const numericReviewId = Number(reviewId);

    if (Number.isNaN(numericReviewId)) {
      throw new BadRequestException('ReviewId không hợp lệ.');
    }

    const review = await this.reviewRepository.findOne({
      where: { id: numericReviewId },
      relations: ['user'],
    });

    if (!review || Number(review.user?.id) !== numericUserId) {
      throw new NotFoundException(
        'Review không tồn tại hoặc không thuộc quyền bạn.',
      );
    }

    await this.reviewRepository.remove(review);
  }

  async listPublicReviews(query: ListReviewQueryDto) {
    const pageNumber = Number(query.page ?? 1);
    const limitNumber = Number(query.limit ?? 20);
    const safePage = pageNumber < 1 ? 1 : pageNumber;
    const safeLimit = limitNumber < 1 ? 20 : limitNumber;

    const qb = this.reviewRepository
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.user', 'user')
      .leftJoinAndSelect('review.supperCourt', 'supperCourt');

    if (query.supperCourtId) {
      qb.andWhere('supperCourt.id = :supCourtId', {
        supCourtId: query.supperCourtId,
      });
    }

    const totalCount = await qb.clone().getCount();
    const data = await qb
      .orderBy('review.createdAt', 'DESC')
      .skip((safePage - 1) * safeLimit)
      .take(safeLimit)
      .getMany();

    return {
      data: plainToInstance(ReviewResponseDto, data, {
        excludeExtraneousValues: true,
      }),
      meta: {
        page: safePage,
        limit: safeLimit,
        total: totalCount,
      },
    };
  }

  async getSummary(supperCourtId: string) {
    const numericSupCourtId = Number(supperCourtId);
    if (Number.isNaN(numericSupCourtId)) {
      throw new BadRequestException('supperCourtId không hợp lệ.');
    }

    const raw = (await this.reviewRepository
      .createQueryBuilder('review')
      .select('AVG(review.rating)', 'avg')
      .addSelect('COUNT(review.id)', 'count')
      .where('review.supper_court_id = :id', { id: numericSupCourtId })
      .getRawOne<{ avg: string | null; count: string }>()) ?? {
      avg: null,
      count: '0',
    };

    const average =
      raw.avg !== null ? Number(Number(raw.avg).toFixed(1)) : null;
    const count = raw.count ? Number(raw.count) : 0;

    return {
        code: 200,
        message: 'Tổng hợp đánh giá',
        data: {
          rating: average,
          reviewCount: count,
        },
    };
  }
}
