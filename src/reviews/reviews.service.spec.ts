import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'nestjs-prisma';
import { ReviewsService } from './reviews.service';

describe('ReviewsService', () => {
  let service: ReviewsService;
  let prisma: {
    review: {
      findMany: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
      create: jest.Mock;
    };
  };

  beforeEach(async () => {
    prisma = {
      review: {
        findMany: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        create: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get(ReviewsService);
  });

  it('getAllApprovedReviews', async () => {
    prisma.review.findMany.mockResolvedValue([]);
    await service.getAllApprovedReviews();
    expect(prisma.review.findMany).toHaveBeenCalledWith({
      where: { isApproved: true },
    });
  });

  it('getNotApprovedReviews', async () => {
    await service.getNotApprovedReviews();
    expect(prisma.review.findMany).toHaveBeenCalledWith({
      where: { isApproved: false },
    });
  });

  it('approveReview', async () => {
    prisma.review.update.mockResolvedValue({ id: '1' });
    await service.approveReview('1');
    expect(prisma.review.update).toHaveBeenCalledWith({
      where: { id: '1' },
      data: { isApproved: true },
    });
  });

  it('deleteReview', async () => {
    prisma.review.delete.mockResolvedValue({ id: '1' });
    await service.deleteReview('1');
  });

  it('addReview', async () => {
    const dto = {
      name: 'n',
      text: 't',
      isApproved: false,
      productId: 'p1',
    };
    prisma.review.create.mockResolvedValue({ id: 'r1' });
    await service.addReview(dto);
    expect(prisma.review.create).toHaveBeenCalledWith({
      data: {
        name: dto.name,
        text: dto.text,
        isApproved: dto.isApproved,
        product: { connect: { id: dto.productId } },
      },
    });
  });
});
