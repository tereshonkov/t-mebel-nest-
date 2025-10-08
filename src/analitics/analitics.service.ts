/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { BetaAnalyticsDataClient } from '@google-analytics/data';
import { AnaliticsRequest } from './dto/analitics.dto';
import * as path from 'path';

@Injectable()
export class AnaliticsService {
  private client: BetaAnalyticsDataClient;
  constructor(private prismaService: PrismaService) {
    this.client = new BetaAnalyticsDataClient({
      keyFile: path.resolve(process.cwd(), 'src/config/service-account.json'),
    });
  }
  private propertyId = 'properties/450691991';

  private async getMetrics(startDate: string, endDate: string) {
    const [response] = await this.client.runReport({
      property: this.propertyId,
      dateRanges: [{ startDate, endDate }],
      metrics: [
        { name: 'screenPageViews' },
        { name: 'activeUsers' },
        { name: 'newUsers' },
      ],
      dimensions: [{ name: 'date' }],
    });

    if (!response.rows) return [];

    const result: AnaliticsRequest[] = [];

    for (const row of response.rows) {
      const date = row.dimensionValues?.[0]?.value ?? '';
      const screenPageViews = row.metricValues?.[0]?.value ?? '0';
      const activeUsers = row.metricValues?.[1]?.value ?? '0';
      const newUsers = row.metricValues?.[2]?.value ?? '0';

      const formattedDate = `${date.slice(6, 8)}.${date.slice(4, 6)}`;

      result.push({
        date: formattedDate,
        screenPageViews,
        activeUsers,
        newUsers,
      });
    }

    return result;
  }

  private async getDailyPageViews() {
    const [response] = await this.client.runReport({
      property: this.propertyId,
      dateRanges: [{ startDate: 'today', endDate: 'today' }],
      metrics: [{ name: 'screenPageViews' }],
      dimensions: [{ name: 'pagePath' }], // 👈 это важно
    });

    if (!response.rows) return [];

    const result: { page: string; views: number }[] = [];

    for (const row of response.rows) {
      const page = row.dimensionValues?.[0]?.value ?? '/';
      const views = Number(row.metricValues?.[0]?.value ?? '0');

      result.push({ page, views });
    }

    return result;
  }

  async getDailyMetrics() {
    return this.getMetrics('today', 'today');
  }

  async getMonthlyMetrics() {
    return this.getMetrics('30daysAgo', 'today');
  }

  async getWeeklyMetrics() {
    return this.getMetrics('7daysAgo', 'today');
  }

  async getPathMetrics() {
    return await this.getDailyPageViews();
  }
}
