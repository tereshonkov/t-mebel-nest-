import { Controller, Req } from '@nestjs/common';
import { CallclickService } from './callclick.service';
import { Post, Body, Get, Headers } from '@nestjs/common';
import { ClickRequest } from './dto/callclick.dto';
import { CallClick } from '@prisma/client';
import type { Request } from 'express';

@Controller('callclick')
export class CallclickController {
  constructor(private readonly callclickService: CallclickService) {}

  @Post('record')
  async recordClick(
    @Body() dto: ClickRequest,
    @Req() req: Request,
  ): Promise<CallClick> {
    const ip =
      req.ip || req.headers['x-forwarded-for']?.toString() || 'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';
    return await this.callclickService.recordClick(dto, ip, userAgent);
  }

  @Get()
  async getAllClicks(): Promise<CallClick[]> {
    return await this.callclickService.getAllClicks();
  }
}
