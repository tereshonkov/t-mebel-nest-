import { Module } from '@nestjs/common';
import { CallclickService } from './callclick.service';
import { CallclickController } from './callclick.controller';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaService } from 'nestjs-prisma';

@Module({
  imports: [AuthModule],
  controllers: [CallclickController],
  providers: [CallclickService, PrismaService],
})
export class CallclickModule {}
