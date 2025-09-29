import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaService } from 'nestjs-prisma';

@Module({
  imports: [AuthModule],
  controllers: [ProductController],
  providers: [ProductService, PrismaService],
})
export class ProductModule {}
