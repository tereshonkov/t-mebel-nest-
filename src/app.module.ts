import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { ReviewsModule } from './reviews/reviews.module';
import { TelegramModule } from './telegram/telegram.module';
import { ConfigModule } from '@nestjs/config/dist/config.module';
import { PrismaService } from 'nestjs-prisma';

@Module({
  imports: [
    AuthModule,
    ProductModule,
    ReviewsModule,
    TelegramModule,
    PrismaService,
    ConfigModule.forRoot({ isGlobal: true, envFilePath: 'env' }),
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
