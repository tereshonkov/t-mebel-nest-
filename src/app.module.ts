import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { ReviewsModule } from './reviews/reviews.module';
import { TelegramModule } from './telegram/telegram.module';
import { ConfigModule } from '@nestjs/config/dist/config.module';

@Module({
  imports: [
    AuthModule,
    ProductModule,
    ReviewsModule,
    TelegramModule,
    ConfigModule.forRoot({ isGlobal: true, envFilePath: 'env' }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
