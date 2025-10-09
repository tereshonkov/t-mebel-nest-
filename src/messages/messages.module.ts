import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaService } from 'nestjs-prisma';

@Module({
  imports: [AuthModule],
  controllers: [MessagesController],
  providers: [MessagesService, PrismaService],
})
export class MessagesModule {}
