const runReport = jest.fn();

jest.mock('@google-analytics/data', () => ({
  BetaAnalyticsDataClient: jest.fn().mockImplementation(() => ({
    runReport,
  })),
}));

import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'nestjs-prisma';
import { AnaliticsService } from './analitics.service';

describe('AnaliticsService', () => {
  let service: AnaliticsService;

  beforeEach(async () => {
    process.env.NODE_ENV = 'test';
    process.env.GOOGLE_SERVICE_ACCOUNT_JSON = JSON.stringify({
      client_email: 'analytics@test',
      private_key: '-----BEGIN PRIVATE KEY-----\\nfake\\n-----END PRIVATE KEY-----',
    });
    runReport.mockReset();
    runReport.mockResolvedValue([
      {
        rows: undefined,
      },
    ]);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnaliticsService,
        {
          provide: PrismaService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get(AnaliticsService);
  });

  it('getDailyMetrics returns empty rows as []', async () => {
    await expect(service.getDailyMetrics()).resolves.toEqual([]);
  });

  it('getMetrics maps row data when rows present', async () => {
    runReport.mockResolvedValueOnce([
      {
        rows: [
          {
            dimensionValues: [{ value: '20250115' }],
            metricValues: [{ value: '10' }, { value: '3' }, { value: '1' }],
          },
        ],
      },
    ]);

    const rows = await service['getMetrics']('2025-01-01', '2025-01-01');
    expect(rows).toEqual([
      {
        date: '15.01',
        screenPageViews: '10',
        activeUsers: '3',
        newUsers: '1',
      },
    ]);
  });

  it('getPathMetrics maps page views', async () => {
    runReport.mockResolvedValueOnce([
      {
        rows: [
          {
            dimensionValues: [{ value: '/home' }],
            metricValues: [{ value: '5' }],
          },
        ],
      },
    ]);

    await expect(service.getPathMetrics()).resolves.toEqual([
      { page: '/home', views: 5 },
    ]);
  });
});
