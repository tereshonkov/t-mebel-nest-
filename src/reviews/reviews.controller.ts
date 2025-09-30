import {
  Controller,
  Post,
  UseGuards,
  Body,
  Get,
  Param,
  Delete,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { JwtAuthGuard } from 'src/auth/guards/auth.guards';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { Role } from '.prisma/client/edge';
import { Roles } from 'src/common/role.decorator';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { ReviewRequest } from './dto/review.dto';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @ApiOperation({ summary: 'Получить все отзывы' })
  @ApiBadRequestResponse({ description: 'Ошибка при получении отзывов' })
  @ApiOkResponse({ description: 'Отзывы успешно получены' })
  @Get()
  async getAllApprovedReviews() {
    return this.reviewsService.getAllApprovedReviews();
  }

  @ApiOperation({ summary: 'Получить все неподтвержденные отзывы' })
  @ApiBadRequestResponse({
    description: 'Ошибка при получении неподтвержденных отзывов',
  })
  @ApiOkResponse({ description: 'Неподтвержденные отзывы успешно получены' })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  @Get('not-approved-reviews')
  async getNotApprovedReviews() {
    return this.reviewsService.getNotApprovedReviews();
  }

  @ApiOperation({ summary: 'Создать отзыв' })
  @ApiBadRequestResponse({ description: 'Ошибка при создании отзыва' })
  @ApiOkResponse({ description: 'Отзыв успешно создан' })
  @Post('create-review')
  async addReview(@Body() dto: ReviewRequest) {
    return this.reviewsService.addReview(dto);
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Удалить отзыв' })
  @ApiBadRequestResponse({ description: 'Ошибка при удалении отзыва' })
  @ApiOkResponse({ description: 'Отзыв успешно удален' })
  @Delete('delete-review/:id')
  async deleteReview(@Param('id') id: string) {
    return this.reviewsService.deleteReview(id);
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Одобрить отзыв' })
  @ApiBadRequestResponse({ description: 'Ошибка при одобрении отзыва' })
  @ApiOkResponse({ description: 'Отзыв успешно одобрен' })
  @Post('approve-review/:id')
  async approveReview(@Param('id') id: string, @Body() dto: ReviewRequest) {
    return this.reviewsService.approveReview(id, dto);
  }
}
