import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { ImageRequest } from './dto/image.dto';
import { Storage } from '@google-cloud/storage';
import { readFileSync } from 'fs';

interface ServiceAccount {
  projectId: string;
  clientEmail: string;
  privateKey: string;
}

@Injectable()
export class ImagesService {
  private readonly storage: Storage;
  private readonly bucketName = 't-mebel';
  private readonly logger = new Logger(ImagesService.name);
  constructor(private readonly prismaService: PrismaService) {
    const credentials: ServiceAccount = JSON.parse(
      readFileSync('service-account.json', 'utf8'),
    ) as ServiceAccount;

    this.storage = new Storage({
      projectId: credentials.projectId,
      credentials: {
        client_email: credentials.clientEmail,
        private_key: credentials.privateKey,
      },
    });
  }

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

  async uploadImage(file: Express.Multer.File): Promise<string> {
    if (!file) {
      throw new Error('Файл не передан');
    }

    const bucket = this.storage.bucket(this.bucketName);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const blob = bucket.file(`${Date.now()}-${file.originalname}`);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const blobStream = blob.createWriteStream({
      resumable: false,
      contentType: file.mimetype,
    });

    return new Promise<string>((resolve, reject) => {
      blobStream.on('error', (err) => {
        this.logger.error('Ошибка загрузки в GCS:', err);
        reject(err);
      });

      blobStream.on('finish', () => {
        const publicUrl = `https://storage.googleapis.com/${this.bucketName}/${blob.name}`;
        this.logger.log(`Файл загружен: ${publicUrl}`);
        resolve(publicUrl);
      });

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      blobStream.end(file.buffer);
    });
  }
}
