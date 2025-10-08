import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CallClick } from '@prisma/client';

@Injectable()
export class CallclickService {
  constructor(private readonly prismaService: PrismaService) {}

  async recordClick(): Promise<CallClick> {
    return await this.prismaService.callClick.create({
      data: {},
    });
  }
  async getAllClicks(): Promise<CallClick[]> {
    return await this.prismaService.callClick.findMany();
  }
}
