import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { ReviewRequest } from './dto/review.dto';
import { Review } from '@prisma/client';

@Injectable()
export class ReviewsService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAllApprovedReviews() {
    return await this.prismaService.review.findMany({
      where: { isApproved: true },
    });
  }

  async getNotApprovedReviews() {
    return this.prismaService.review.findMany({
      where: { isApproved: false },
    });
  }

  async approveReview(id: string): Promise<Review> {
    return this.prismaService.review.update({
      where: { id },
      data: { isApproved: true },
    });
  }

  async deleteReview(id: string): Promise<Review> {
    return this.prismaService.review.delete({
      where: { id },
    });
  }

  async addReview(dto: ReviewRequest): Promise<Review> {
    const { name, text, isApproved, productId } = dto;

    return this.prismaService.review.create({
      data: {
        name,
        text,
        isApproved,
        product: { connect: { id: productId } },
      },
    });
  }
}
