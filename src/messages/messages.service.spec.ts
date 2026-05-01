import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'nestjs-prisma';
import { MessagesService } from './messages.service';

describe('MessagesService', () => {
  let service: MessagesService;
  let prisma: {
    messages: {
      create: jest.Mock;
      findMany: jest.Mock;
      update: jest.Mock;
    };
  };

  beforeEach(async () => {
    prisma = {
      messages: {
        create: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessagesService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get(MessagesService);
  });

  it('createMessages', async () => {
    const dto = { message: 'hi', name: 'x', phone: '1' };
    prisma.messages.create.mockResolvedValue({ id: '1' });
    await service.createMessages(dto);
    expect(prisma.messages.create).toHaveBeenCalledWith({
      data: {
        message: dto.message,
        name: dto.name,
        phone: dto.phone,
      },
    });
  });

  it('getMessages filters unread', async () => {
    await service.getMessages();
    expect(prisma.messages.findMany).toHaveBeenCalledWith({
      where: { read: false },
    });
  });

  it('markAsRead', async () => {
    prisma.messages.update.mockResolvedValue({ id: '1', read: true });
    await service.markAsRead('1');
    expect(prisma.messages.update).toHaveBeenCalledWith({
      where: { id: '1' },
      data: { read: true },
    });
  });
});
