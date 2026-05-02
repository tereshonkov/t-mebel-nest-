import { Injectable, NotFoundException } from '@nestjs/common';
import { Locale, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ProductRequest } from './dto/product.dto';
import {
  DEFAULT_REQUEST_LOCALE,
  parseLocaleParam,
  resolveLocalizedFields,
  type TranslationRow,
} from './product-locale';

const productInclude = {
  images: true,
  reviews: true,
  translations: true,
} satisfies Prisma.ProductInclude;

type ProductWithRelations = Prisma.ProductGetPayload<{
  include: typeof productInclude;
}>;

@Injectable()
export class ProductService {
  constructor(private readonly prismaService: PrismaService) {}

  private buildTranslationRows(
    dto: ProductRequest,
  ): Array<{
    locale: Locale;
    title: string;
    description: string;
    titleSeo: string | null;
  }> {
    const ruTitle = dto.translations?.ru?.title ?? dto.title;
    const ruDescription = dto.translations?.ru?.description ?? dto.description;
    const ruTitleSeo = dto.translations?.ru?.titleSeo?.trim()
      ? dto.translations.ru.titleSeo.trim()
      : null;

    const rows: Array<{
      locale: Locale;
      title: string;
      description: string;
      titleSeo: string | null;
    }> = [
      {
        locale: Locale.ru,
        title: ruTitle,
        description: ruDescription,
        titleSeo: ruTitleSeo,
      },
    ];

    if (dto.translations?.uk) {
      rows.push({
        locale: Locale.uk,
        title: dto.translations.uk.title,
        description: dto.translations.uk.description,
        titleSeo: dto.translations.uk.titleSeo?.trim()
          ? dto.translations.uk.titleSeo.trim()
          : null,
      });
    }

    if (dto.translations?.en) {
      rows.push({
        locale: Locale.en,
        title: dto.translations.en.title,
        description: dto.translations.en.description,
        titleSeo: dto.translations.en.titleSeo?.trim()
          ? dto.translations.en.titleSeo.trim()
          : null,
      });
    }

    return rows;
  }

  private toLocalizedProduct(
    product: ProductWithRelations,
    localeParam?: string,
  ) {
    const locale = parseLocaleParam(localeParam);
    const { translations, ...rest } = product;
    const resolved = resolveLocalizedFields(
      (translations ?? []) as TranslationRow[],
      locale,
      rest.title,
      rest.description,
    );
    return {
      ...(rest as Omit<typeof rest, never>),
      ...resolved,
    };
  }

  async getAll(locale?: string) {
    const products = await this.prismaService.product.findMany({
      include: productInclude,
    });

    if (products.length === 0) {
      throw new NotFoundException('Продукты не найдены');
    }

    return products.map((p) => this.toLocalizedProduct(p, locale));
  }

  async getById(id: string, locale?: string) {
    const product = await this.prismaService.product.findUnique({
      where: { id },
      include: productInclude,
    });

    if (!product) {
      throw new NotFoundException('Продукт не найден');
    }

    return this.toLocalizedProduct(product, locale);
  }

  async createProduct(dto: ProductRequest) {
    const translationCreates = this.buildTranslationRows(dto);
    const created = await this.prismaService.product.create({
      data: {
        title: dto.title,
        description: dto.description,
        category: dto.category,
        translations: {
          create: translationCreates,
        },
        images: dto.images?.length
          ? {
              create: dto.images.map((img, index) => ({
                ...img,
                isCover: index === 0,
              })),
            }
          : undefined,
      },
      include: productInclude,
    });

    return this.toLocalizedProduct(created, DEFAULT_REQUEST_LOCALE);
  }

  async deleteProduct(id: string) {
    return this.prismaService.product.delete({
      where: { id },
    });
  }

  async updateProduct(id: string, dto: ProductRequest) {
    const existing = await this.prismaService.product.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException('Продукт не найден');
    }

    const translationRows = this.buildTranslationRows(dto);

    await this.prismaService.$transaction(async (tx) => {
      await tx.product.update({
        where: { id },
        data: {
          title: dto.title,
          description: dto.description,
          category: dto.category,
          images: dto.images?.length
            ? {
                create: dto.images.map((img, index) => ({
                  ...img,
                  isCover: index === 0,
                })),
              }
            : undefined,
        },
      });

      for (const row of translationRows) {
        await tx.productTranslation.upsert({
          where: {
            productId_locale: {
              productId: id,
              locale: row.locale,
            },
          },
          create: {
            productId: id,
            locale: row.locale,
            title: row.title,
            description: row.description,
            titleSeo: row.titleSeo,
          },
          update: {
            title: row.title,
            description: row.description,
            titleSeo: row.titleSeo,
          },
        });
      }
    });

    const updated = await this.prismaService.product.findUniqueOrThrow({
      where: { id },
      include: productInclude,
    });

    return this.toLocalizedProduct(updated, DEFAULT_REQUEST_LOCALE);
  }
}
