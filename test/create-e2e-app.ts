import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import cookieParser from 'cookie-parser';
import { AppModule } from '../src/app.module';
import { ImagesService } from '../src/images/images.service';
import { AnaliticsService } from '../src/analitics/analitics.service';

export const e2eImagesServiceMock: Pick<
  ImagesService,
  | 'addImage'
  | 'deleteImage'
  | 'getAllImages'
  | 'getImageById'
  | 'updateImage'
  | 'uploadImage'
> = {
  addImage: jest.fn(),
  deleteImage: jest.fn(),
  getAllImages: jest.fn().mockResolvedValue([{ id: '1', url: 'http://x' }]),
  getImageById: jest.fn(),
  updateImage: jest.fn(),
  uploadImage: jest.fn().mockResolvedValue('https://storage.mock/file'),
};

export const e2eAnaliticsServiceMock: Pick<
  AnaliticsService,
  | 'getDailyMetrics'
  | 'getMonthlyMetrics'
  | 'getWeeklyMetrics'
  | 'getPathMetrics'
> = {
  getDailyMetrics: jest.fn().mockResolvedValue([]),
  getMonthlyMetrics: jest.fn().mockResolvedValue([]),
  getWeeklyMetrics: jest.fn().mockResolvedValue([]),
  getPathMetrics: jest.fn().mockResolvedValue([]),
};

export async function createE2eTestingModule(): Promise<TestingModule> {
  return Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(ImagesService)
    .useValue(e2eImagesServiceMock)
    .overrideProvider(AnaliticsService)
    .useValue(e2eAnaliticsServiceMock)
    .compile();
}

export function configureE2eApp(app: INestApplication): void {
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
}
