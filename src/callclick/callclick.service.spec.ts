import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'nestjs-prisma';
import { CallclickService } from './callclick.service';

describe('CallclickService', () => {
  let service: CallclickService;
  let prisma: {
    callClick: {
      create: jest.Mock;
      findMany: jest.Mock;
    };
  };

  beforeEach(async () => {
    prisma = {
      callClick: {
        create: jest.fn(),
        findMany: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CallclickService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get(CallclickService);
  });

  it('recordClick', async () => {
    prisma.callClick.create.mockResolvedValue({ id: 'c1', createdAt: new Date() });
    await service.recordClick();
    expect(prisma.callClick.create).toHaveBeenCalledWith({ data: {} });
  });

  it('getAllClicks', async () => {
    prisma.callClick.findMany.mockResolvedValue([]);
    await service.getAllClicks();
    expect(prisma.callClick.findMany).toHaveBeenCalled();
  });
});
