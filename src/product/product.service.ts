import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProductRequest } from './dto/product.dto';

@Injectable()
export class ProductService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAll() {
    const products = await this.prismaService.product.findMany();

    if (products.length === 0) {
      throw new NotFoundException('Продукты не найдены');
    }

    return products;
  }

  async getById(id: string) {
    const product = await this.prismaService.product.findUnique({
      where: {
        id,
      },
    });

    if (!product) {
      throw new NotFoundException('Продукт не найден');
    }

    return product;
  }

  async createProduct(dto: ProductRequest) {
    return await this.prismaService.product.create({ data: { ...dto } });
  }

  async deleteProduct(id: string) {
    const product = await this.prismaService.product.delete({
      where: {
        id,
      },
    });

    return product;
  }

  async updateProduct(id: string, dto: ProductRequest) {
    const product = await this.prismaService.product.update({
      where: {
        id,
      },
      data: {
        ...dto,
      },
    });

    return product;
  }
}
