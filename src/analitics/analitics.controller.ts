import { Controller, UseGuards } from '@nestjs/common';
import { AnaliticsService } from './analitics.service';
import { Get } from '@nestjs/common';
import { AnaliticsRequest } from './dto/analitics.dto';
import { Role } from '@prisma/client';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/auth.guards';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { Roles } from '../common/role.decorator';

@Controller('analitycs')
export class AnaliticsController {
  constructor(private readonly analiticsService: AnaliticsService) {}

  @ApiOperation({
    summary: 'Получить количество просмотров страниц за день',
  })
  @ApiOkResponse({ type: [AnaliticsRequest] })
  @ApiBadRequestResponse({ description: 'Ошибка запроса' })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  @Get('day')
  async getDailyMetrics(): Promise<any> {
    return await this.analiticsService.getDailyMetrics();
  }

  @ApiOperation({
    summary: 'Получить количество просмотров страниц за месяц',
  })
  @ApiOkResponse({ type: [AnaliticsRequest] })
  @ApiBadRequestResponse({ description: 'Ошибка запроса' })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  @Get('month')
  async getMonthlyMetrics(): Promise<any> {
    return await this.analiticsService.getMonthlyMetrics();
  }

  @ApiOperation({
    summary: 'Получить количество просмотров страниц за неделю',
  })
  @ApiOkResponse({ type: [AnaliticsRequest] })
  @ApiBadRequestResponse({ description: 'Ошибка запроса' })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  @Get('week')
  async getWeeklyMetrics(): Promise<any> {
    return await this.analiticsService.getWeeklyMetrics();
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  @Get('pageviews')
  async getDailyPageViews(): Promise<any> {
    return this.analiticsService.getPathMetrics();
  }
}
