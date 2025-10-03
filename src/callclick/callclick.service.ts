import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { ClickRequest } from './dto/callclick.dto';
import { CallClick } from '@prisma/client';

@Injectable()
export class CallclickService {
  constructor(private readonly prismaService: PrismaService) {}

  async recordClick(
    dto: ClickRequest & { visitorId: string },
  ): Promise<CallClick> {
    return await this.prismaService.callClick.create({
      data: {
        visitorId: dto.visitorId,
      },
    });
  }
  async getAllClicks(): Promise<CallClick[]> {
    return await this.prismaService.callClick.findMany();
  }
}
