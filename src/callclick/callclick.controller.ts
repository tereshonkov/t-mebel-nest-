import { Controller } from '@nestjs/common';
import { CallclickService } from './callclick.service';
import { Post, Body, Get } from '@nestjs/common';
import { ClickRequest } from './dto/callclick.dto';
import { CallClick } from '@prisma/client';

@Controller('callclick')
export class CallclickController {
  constructor(private readonly callclickService: CallclickService) {}

  @Post('record')
  async recordClick(@Body() dto: ClickRequest): Promise<CallClick> {
    return await this.callclickService.recordClick(dto);
  }

  @Get()
  async getAllClicks(): Promise<CallClick[]> {
    return await this.callclickService.getAllClicks();
  }
}
