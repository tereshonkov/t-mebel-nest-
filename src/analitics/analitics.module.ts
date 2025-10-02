import { Module } from '@nestjs/common';
import { AnaliticsService } from './analitics.service';
import { AnaliticsController } from './analitics.controller';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaService } from 'nestjs-prisma';

@Module({
  imports: [AuthModule],
  controllers: [AnaliticsController],
  providers: [AnaliticsService, PrismaService],
})
export class AnaliticsModule {}
