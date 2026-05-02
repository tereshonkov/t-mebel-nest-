import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Category, Locale } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ProductService } from './product.service';

describe('ProductService', () => {
  let service: ProductService;
  let prisma: {
    product: {
      findMany: jest.Mock;
      findUnique: jest.Mock;
      findUniqueOrThrow: jest.Mock;
      create: jest.Mock;
      delete: jest.Mock;
      update: jest.Mock;
    };
    productTranslation: {
      upsert: jest.Mock;
    };
    $transaction: jest.Mock;
  };

  const sampleProduct = {
    id: 'p1',
    title: 'Ru title',
    description: 'Ru desc',
    category: Category.KITCHEN,
    createdAt: new Date(),
    updatedAt: new Date(),
    images: [],
    reviews: [],
    translations: [
      {
        locale: Locale.ru,
        title: 'Ru title',
        description: 'Ru desc',
        titleSeo: null,
      },
      {
        locale: Locale.uk,
        title: 'Uk title',
        description: 'Uk desc',
        titleSeo: 'Uk seo',
      },
    ],
  };

  beforeEach(async () => {
    prisma = {
      product: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        findUniqueOrThrow: jest.fn(),
        create: jest.fn(),
        delete: jest.fn(),
        update: jest.fn(),
      },
      productTranslation: {
        upsert: jest.fn(),
      },
      $transaction: jest.fn(async (cb: (tx: unknown) => Promise<unknown>) =>
        cb({
          product: { update: prisma.product.update },
          productTranslation: { upsert: prisma.productTranslation.upsert },
        }),
      ),
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

  it('getAll maps locale uk', async () => {
    prisma.product.findMany.mockResolvedValue([sampleProduct]);
    const out = await service.getAll('uk');
    expect(out[0].title).toBe('Uk title');
    expect(out[0].localeApplied).toBe(Locale.uk);
    expect(out[0].translationFallback).toBe(false);
  });

  it('getById throws when missing', async () => {
    prisma.product.findUnique.mockResolvedValue(null);
    await expect(service.getById('x')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('getById maps locale', async () => {
    prisma.product.findUnique.mockResolvedValue(sampleProduct);
    const out = await service.getById('p1', 'ru');
    expect(out.title).toBe('Ru title');
    expect(out.localeApplied).toBe(Locale.ru);
  });

  it('createProduct with images sets first as cover and creates translations', async () => {
    const dto = {
      title: 't',
      description: 'd',
      category: Category.KITCHEN,
      translations: {
        uk: { title: 'tu', description: 'du' },
      },
      images: [{ url: 'a' }, { url: 'b' }],
    };
    prisma.product.create.mockResolvedValue({
      ...sampleProduct,
      translations: [
        { locale: Locale.ru, title: 't', description: 'd', titleSeo: null },
        { locale: Locale.uk, title: 'tu', description: 'du', titleSeo: null },
      ],
    });

    await service.createProduct(dto);

    expect(prisma.product.create).toHaveBeenCalledWith({
      data: {
        title: dto.title,
        description: dto.description,
        category: dto.category,
        translations: {
          create: [
            {
              locale: Locale.ru,
              title: 't',
              description: 'd',
              titleSeo: null,
            },
            {
              locale: Locale.uk,
              title: 'tu',
              description: 'du',
              titleSeo: null,
            },
          ],
        },
        images: {
          create: [
            { url: 'a', isCover: true },
            { url: 'b', isCover: false },
          ],
        },
      },
      include: expect.any(Object),
    });
  });

  it('updateProduct upserts translations', async () => {
    prisma.product.findUnique.mockResolvedValueOnce({ id: 'id' });
    prisma.product.update.mockResolvedValue({});
    prisma.productTranslation.upsert.mockResolvedValue({});
    prisma.product.findUniqueOrThrow.mockResolvedValue(sampleProduct);

    const dto = {
      title: 't',
      description: 'd',
      category: Category.OTHER,
      translations: {
        en: { title: 'En', description: 'Ed' },
      },
    };

    await service.updateProduct('id', dto);

    expect(prisma.productTranslation.upsert).toHaveBeenCalled();
    expect(prisma.product.update).toHaveBeenCalled();
  });

  it('deleteProduct delegates to prisma', async () => {
    prisma.product.delete.mockResolvedValue({ id: '1' });
    await expect(service.deleteProduct('1')).resolves.toEqual({ id: '1' });
  });
});
