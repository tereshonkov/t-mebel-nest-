import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { ClickRequest } from './dto/callclick.dto';
import { CallClick } from '@prisma/client';

@Injectable()
export class CallclickService {
  constructor(private readonly prismaService: PrismaService) {}

  async recordClick(
    dto: ClickRequest,
    ip: string,
    userAgent: string,
  ): Promise<CallClick> {
    let visitor = await this.prismaService.visitor.findUnique({
      where: { ip },
    });

    if (!visitor) {
      visitor = await this.prismaService.visitor.create({
        data: { ip, userAgent },
      });
    }
    return await this.prismaService.callClick.create({
      data: {
        visitor: {
          connect: { id: visitor.id },
        },
      },
    });
  }
  async getAllClicks(): Promise<CallClick[]> {
    return await this.prismaService.callClick.findMany();
  }
}
