import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { PageVisitRequest } from './dto/pagevisit.dto';
import { PageVisit } from '@prisma/client/index-browser';
import { startOfWeek, endOfWeek } from 'date-fns';
import { StatsDto } from './dto/stats.dto';

@Injectable()
export class PagevisitService {
  constructor(private readonly prismaService: PrismaService) {}

  async recordPageVisit(dto: PageVisitRequest): Promise<PageVisit> {
    return await this.prismaService.pageVisit.create({
      data: {
        visitorId: dto.visitorId,
        url: dto.url,
      },
    });
  }

  async getPageVisits(): Promise<StatsDto[]> {
    const result = await this.prismaService.pageVisit.groupBy({
      by: ['url'],
      where: {
        createdAt: {
          gte: startOfWeek(new Date(), { weekStartsOn: 1 }),
          lt: endOfWeek(new Date(), { weekStartsOn: 1 }),
        },
      },
      _count: {
        url: true,
      },
      orderBy: {
        _count: {
          url: 'desc',
        },
      },
    });
    return result.map((item) => ({
      url: item.url,
      views: item._count.url,
    }));
  }
}
