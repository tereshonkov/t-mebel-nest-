import { Controller } from '@nestjs/common';
import { CallclickService } from './callclick.service';
import { Post, Body, Get, Headers } from '@nestjs/common';
import { CallClick } from '@prisma/client';

@Controller('callclick')
export class CallclickController {
  constructor(private readonly callclickService: CallclickService) {}

  @Post('record')
  async recordClick(): Promise<CallClick> {
    return await this.callclickService.recordClick();
  }

  @Get()
  async getAllClicks(): Promise<CallClick[]> {
    return await this.callclickService.getAllClicks();
  }
}
