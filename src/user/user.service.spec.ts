import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'nestjs-prisma';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let prisma: {
    user: {
      findMany: jest.Mock;
      findUnique: jest.Mock;
      delete: jest.Mock;
    };
  };

  beforeEach(async () => {
    prisma = {
      user: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get(UserService);
  });

  it('getAllUsers', async () => {
    prisma.user.findMany.mockResolvedValue([{ id: '1' }]);
    await expect(service.getAllUsers()).resolves.toEqual([{ id: '1' }]);
  });

  it('getUserById', async () => {
    prisma.user.findUnique.mockResolvedValue({ id: 'u' });
    await expect(service.getUserById('u')).resolves.toEqual({ id: 'u' });
  });

  it('deleteUser', async () => {
    prisma.user.delete.mockResolvedValue({ id: 'u' });
    await expect(service.deleteUser('u')).resolves.toEqual({ id: 'u' });
  });
});
