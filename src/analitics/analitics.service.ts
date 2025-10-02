/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { startOfDay, endOfDay, startOfMonth, endOfMonth } from 'date-fns';
import { AnaliticsRequest } from './dto/analitics.dto';
import { Prisma, Visitor } from '@prisma/client';

type VisitorWithRelations = Prisma.VisitorGetPayload<{
  include: { visits: true; called: true };
}>;

@Injectable()
export class AnaliticsService {
  constructor(private prismaService: PrismaService) {}

  async getVisitors(): Promise<AnaliticsRequest[]> {
    const visitors = await this.prismaService.visitor.findMany({
      include: { visits: true, called: true },
    });
    return visitors;
  }

  async getDailyUsers() {
    const result = await this.prismaService.user.count({
      where: {
        createdAt: {
          gte: startOfDay(new Date()),
          lt: endOfDay(new Date()),
        },
      },
    });
    return { dailyUsers: result };
  }

  async getMonthlyUsers() {
    const result = await this.prismaService.user.count({
      where: {
        createdAt: {
          gte: startOfMonth(new Date()),
          lt: endOfMonth(new Date()),
        },
      },
    });
    return { monthlyUsers: result };
  }

  async postPageVisit(dto: AnaliticsRequest): Promise<Visitor> {
    if (typeof dto.ip !== 'string') {
      throw new Error('IP должен быть строкой');
    }

    if (dto.userAgent && typeof dto.userAgent !== 'string') {
      throw new Error('userAgent должен быть строкой');
    }
    const visitor = await this.prismaService.visitor.upsert({
      where: { ip: dto.ip },
      update: { userAgent: dto.userAgent },
      create: {
        ip: dto.ip,
        userAgent: dto.userAgent,
      } as Prisma.VisitorUncheckedCreateInput,
    });

    if (dto.url) {
      await this.prismaService.pageVisit.create({
        data: {
          url: dto.url,
          visitorId: visitor.id,
        },
      });
    }
    return visitor;
  }
}
