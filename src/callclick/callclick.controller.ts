import { Controller } from '@nestjs/common';
import { CallclickService } from './callclick.service';
import { Post, Body, Get, Headers } from '@nestjs/common';
import { ClickRequest } from './dto/callclick.dto';
import { CallClick } from '@prisma/client';
import { AuthService } from 'src/auth/auth.service';

@Controller('callclick')
export class CallclickController {
  constructor(
    private readonly callclickService: CallclickService,
    private readonly authService: AuthService,
  ) {}

  @Post('record')
  async recordClick(
    @Body() dto: ClickRequest,
    @Headers('authorization') authHeader: string,
  ): Promise<CallClick> {
    const token = authHeader?.split(' ')[1];

    const visitorId = this.authService.extractIdFromToken(token);
    return await this.callclickService.recordClick({
      ...dto,
      visitorId,
    });
  }

  @Get()
  async getAllClicks(): Promise<CallClick[]> {
    return await this.callclickService.getAllClicks();
  }
}
