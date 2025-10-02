import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { PageVisitRequest } from './dto/pagevisit.dto';
import { PageVisit } from '@prisma/client/index-browser';

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
}
