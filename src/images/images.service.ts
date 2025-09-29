import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { ImageRequest } from './dto/image.dto';

@Injectable()
export class ImagesService {
  constructor(private readonly prismaService: PrismaService) {}

  async addImage(dto: ImageRequest) {
    return await this.prismaService.image.create({ data: { ...dto } });
  }

  async deleteImage(id: string) {
    return await this.prismaService.image.delete({
      where: { id },
    });
  }

  async getAllImages() {
    const images = await this.prismaService.image.findMany();

    if (images.length === 0) {
      throw new NotFoundException('Изображения не найдены');
    }

    return images;
  }

  async getImageById(id: string) {
    return await this.prismaService.image.findUnique({
      where: { id },
    });
  }

  async updateImage(id: string, dto: ImageRequest) {
    return await this.prismaService.image.update({
      where: { id },
      data: { ...dto },
    });
  }
}
