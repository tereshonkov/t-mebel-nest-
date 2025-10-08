import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { setupSwagger } from './utils/swagger.utils';
import express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const expressApp = app.getHttpAdapter().getInstance() as express.Express;
  expressApp.set('trust proxy', 1);

  app.enableCors({
    origin: [
      'https://www.t-mebel.com.ua',
      'http://localhost:3000',
      'http://localhost:3001',
    ],
    credentials: true,
  });

  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  setupSwagger(app);

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
