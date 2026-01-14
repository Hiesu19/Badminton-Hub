import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserAuth } from 'src/shared/decorators/role-auth.decorator';
import { CustomResponse } from 'src/shared/decorators/custom-response.decorator';
import { CreateReviewDto } from './dto/create-review.dto';
import { ListReviewQueryDto } from './dto/list-review-query.dto';
import { ReviewResponseDto } from './dto/review-response.dto';
import { ReviewSummaryResponseDto } from './dto/review-summary-response.dto';
import { ReviewService } from './review.service';

@Controller('reviews')
@ApiTags('Reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  @UserAuth()
  @CustomResponse(ReviewResponseDto, {
    message: 'Tạo review thành công',
    description: '[user] Gửi đánh giá cho cụm sân',
  })
  async createReview(
    @Req() req: Request & { user?: any },
    @Body() dto: CreateReviewDto,
  ) {
    return this.reviewService.createReview(req.user.id, dto);
  }

  @Delete(':reviewId')
  @UserAuth()
  @CustomResponse('string', {
    message: 'Xóa review',
    description: '[user] Xóa review của mình',
  })
  async deleteReview(
    @Req() req: Request & { user?: any },
    @Param('reviewId') reviewId: string,
  ) {
    await this.reviewService.deleteReview(req.user.id, reviewId);
    return 'Xóa review thành công';
  }

  @Get()
  @CustomResponse(ReviewResponseDto, {
    message: 'Danh sách review',
    description: '[public] Lấy review theo cụm sân',
    isPagination: true,
  })
  async listPublic(@Query() query: ListReviewQueryDto) {
    return this.reviewService.listPublicReviews(query);
  }

  @Get('supper-courts/:supperCourtId/summary')
  // @CustomResponse(ReviewSummaryResponseDto, {
  //   message: 'Tổng hợp đánh giá',
  //   description: '[public] Điểm trung bình và số review của cụm sân',
  // })
  async getSummary(@Param('supperCourtId') supperCourtId: string) {
    return this.reviewService.getSummary(supperCourtId);
  }
}
