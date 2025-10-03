/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { AnaliticsRequest } from './dto/analitics.dto';
import { Prisma, Visitor } from '@prisma/client';

export interface VisitorWithRelations {
  id: string;
  ip: string;
  userAgent: string;
  createdAt: Date;
  updatedAt: Date;
  visits: {
    id: string;
    url: string;
    createdAt: Date;
    updatedAt: Date;
    visitorId: string;
  }[];
  called: { id: string; createdAt: Date; updatedAt: Date; visitorId: string }[];
}

@Injectable()
export class AnaliticsService {
  constructor(private prismaService: PrismaService) {}

  async getVisitors(): Promise<VisitorWithRelations[]> {
    const visitors = await this.prismaService.visitor.findMany({
      include: { visits: true, called: true },
    });
    return visitors;
  }

  async getDailyUsers() {
    const now = new Date();

    const start = new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        0,
        0,
        0,
      ),
    );
    const end = new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        23,
        59,
        59,
      ),
    );
    const result = await this.prismaService.visitor.count({
      where: {
        createdAt: {
          gte: start,
          lte: end,
        },
      },
    });
    return { dailyUsers: result };
  }

  async getMonthlyUsers() {
    const now = new Date();

    const start = new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        0,
        0,
        0,
      ),
    );
    const end = new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        23,
        59,
        59,
      ),
    );
    const result = await this.prismaService.visitor.count({
      where: {
        createdAt: {
          gte: start,
          lte: end,
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

    console.log('Visitor created:', visitor);
    console.log('URL to save:', dto.url);
    return visitor;
  }
}
