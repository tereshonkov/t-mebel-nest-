import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { MessageRequest } from './dto/messages.dto';

@Injectable()
export class MessagesService {
  constructor(private readonly prismaService: PrismaService) {}

  async createMessages(dto: MessageRequest): Promise<any> {
    return await this.prismaService.messages.create({
      data: {
        message: dto.message,
        name: dto.name,
        phone: dto.phone,
      },
    });
  }

  async getMessages(): Promise<any> {
    return await this.prismaService.messages.findMany({
      where: {
        read: false,
      },
    });
  }

  async markAsRead(id: string): Promise<any> {
    return await this.prismaService.messages.update({
      where: { id },
      data: { read: true },
    });
  }
}
