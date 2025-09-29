import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { ReviewsModule } from './reviews/reviews.module';
import { TelegramModule } from './telegram/telegram.module';
import { ConfigModule } from '@nestjs/config/dist/config.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { getJwtConfig } from './config/jwt.config';
import { ConfigService } from '@nestjs/config';
import { PrismaModule } from 'nestjs-prisma';
import { UserModule } from './user/user.module';
import { ImagesModule } from './images/images.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: 'env' }),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: getJwtConfig,
      inject: [ConfigService],
    }),
    AuthModule,
    ProductModule,
    ReviewsModule,
    TelegramModule,
    PrismaModule,
    UserModule,
    ImagesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
