import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Category } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ProductService } from './product.service';

describe('ProductService', () => {
  let service: ProductService;
  let prisma: {
    product: {
      findMany: jest.Mock;
      findUnique: jest.Mock;
      create: jest.Mock;
      delete: jest.Mock;
      update: jest.Mock;
    };
  };

  beforeEach(async () => {
    prisma = {
      product: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        delete: jest.fn(),
        update: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get(ProductService);
  });

  it('getAll throws when empty', async () => {
    prisma.product.findMany.mockResolvedValue([]);
    await expect(service.getAll()).rejects.toBeInstanceOf(NotFoundException);
  });

  it('getAll returns products', async () => {
    const rows = [{ id: '1', title: 't', images: [], reviews: [] }];
    prisma.product.findMany.mockResolvedValue(rows);
    await expect(service.getAll()).resolves.toEqual(rows);
  });

  it('getById throws when missing', async () => {
    prisma.product.findUnique.mockResolvedValue(null);
    await expect(service.getById('x')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('getById returns product', async () => {
    const row = { id: '1', title: 't', images: [], reviews: [] };
    prisma.product.findUnique.mockResolvedValue(row);
    await expect(service.getById('1')).resolves.toEqual(row);
  });

  it('createProduct with images sets first as cover', async () => {
    const dto = {
      title: 't',
      description: 'd',
      category: Category.KITCHEN,
      images: [{ url: 'a' }, { url: 'b' }],
    };
    prisma.product.create.mockResolvedValue({ id: 'p1', ...dto });
    await service.createProduct(dto);
    expect(prisma.product.create).toHaveBeenCalledWith({
      data: {
        title: dto.title,
        description: dto.description,
        category: dto.category,
        images: {
          create: [
            { url: 'a', isCover: true },
            { url: 'b', isCover: false },
          ],
        },
      },
    });
  });

  it('updateProduct passes nested images', async () => {
    const dto = {
      title: 't',
      description: 'd',
      category: Category.OTHER,
      images: [{ url: 'x' }],
    };
    prisma.product.update.mockResolvedValue({ id: 'id', ...dto });
    await service.updateProduct('id', dto);
    expect(prisma.product.update).toHaveBeenCalledWith({
      where: { id: 'id' },
      data: {
        title: dto.title,
        description: dto.description,
        category: dto.category,
        images: {
          create: [{ url: 'x', isCover: true }],
        },
      },
    });
  });

  it('deleteProduct delegates to prisma', async () => {
    prisma.product.delete.mockResolvedValue({ id: '1' });
    await expect(service.deleteProduct('1')).resolves.toEqual({ id: '1' });
  });
});
