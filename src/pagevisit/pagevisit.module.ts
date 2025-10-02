import { Module } from '@nestjs/common';
import { PagevisitService } from './pagevisit.service';
import { PagevisitController } from './pagevisit.controller';
import { PrismaService } from 'nestjs-prisma';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [PagevisitController],
  providers: [PagevisitService, PrismaService],
})
export class PagevisitModule {}
