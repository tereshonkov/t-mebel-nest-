jest.mock('fs', () => ({
  ...jest.requireActual<typeof import('fs')>('fs'),
  readFileSync: jest.fn(() =>
    JSON.stringify({
      project_id: 'proj',
      client_email: 'svc@test',
      private_key:
        '-----BEGIN PRIVATE KEY-----\nmock\n-----END PRIVATE KEY-----\n',
    }),
  ),
}));

jest.mock('@google-cloud/storage', () => ({
  Storage: jest.fn().mockImplementation(() => ({
    bucket: jest.fn(() => ({
      file: jest.fn(() => ({
        createWriteStream: jest.fn(() => {
          const stream = {
            on: jest.fn((ev: string, fn: () => void) => {
              if (ev === 'finish') {
                setImmediate(fn);
              }
              return stream;
            }),
            end: jest.fn(),
          };
          return stream;
        }),
      })),
    })),
  })),
}));

import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'nestjs-prisma';
import { ImagesService } from './images.service';

describe('ImagesService', () => {
  let service: ImagesService;
  let prisma: {
    image: {
      create: jest.Mock;
      delete: jest.Mock;
      findMany: jest.Mock;
      findUnique: jest.Mock;
      update: jest.Mock;
    };
  };

  beforeEach(async () => {
    prisma = {
      image: {
        create: jest.fn(),
        delete: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ImagesService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get(ImagesService);
  });

  it('getAllImages throws when empty', async () => {
    prisma.image.findMany.mockResolvedValue([]);
    await expect(service.getAllImages()).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('addImage delegates to prisma', async () => {
    const dto = { url: 'http://x', isCover: false };
    prisma.image.create.mockResolvedValue({ id: '1' });
    await service.addImage(dto);
    expect(prisma.image.create).toHaveBeenCalledWith({ data: { ...dto } });
  });

  it('uploadImage resolves public url', async () => {
    const file = {
      originalname: 'a.png',
      mimetype: 'image/png',
      buffer: Buffer.from('x'),
    } as Express.Multer.File;

    const url = await service.uploadImage(file);
    expect(url).toContain('storage.googleapis.com');
  });

  it('uploadImage throws when file missing', async () => {
    await expect(service.uploadImage(undefined as never)).rejects.toThrow(
      'Файл не передан',
    );
  });
});
