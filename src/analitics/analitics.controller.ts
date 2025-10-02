import { Controller, UseGuards } from '@nestjs/common';
import { AnaliticsService } from './analitics.service';
import { Get, Post, Body } from '@nestjs/common';
import { AnaliticsRequest } from './dto/analitics.dto';
import { Role, Visitor } from '@prisma/client';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/auth.guards';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { Roles } from '../common/role.decorator';

@Controller('analitics')
export class AnaliticsController {
  constructor(private readonly analiticsService: AnaliticsService) {}

  @ApiOperation({
    summary: 'Получить информацию о посетителях',
  })
  @ApiBadRequestResponse({ description: 'Ошибка запроса' })
  @ApiOkResponse({ type: AnaliticsRequest, description: 'Успешный ответ' })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  @Get('visitors')
  async getVisitors(): Promise<AnaliticsRequest[]> {
    return await this.analiticsService.getVisitors();
  }

  @ApiOperation({
    summary: 'Получить количество новых пользователей за сегодня',
  })
  @ApiBadRequestResponse({ description: 'Ошибка запроса' })
  @ApiOkResponse({ description: 'Успешный ответ' })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  @Get('daily-users')
  async getDailyUsers() {
    return await this.analiticsService.getDailyUsers();
  }

  @ApiOperation({
    summary: 'Получить количество новых пользователей за текущий месяц',
  })
  @ApiBadRequestResponse({ description: 'Ошибка запроса' })
  @ApiOkResponse({ description: 'Успешный ответ' })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  @Get('monthly-users')
  async getMonthlyUsers() {
    return await this.analiticsService.getMonthlyUsers();
  }

  @ApiOperation({ summary: 'Записать посещение страницы' })
  @ApiBadRequestResponse({ description: 'Ошибка запроса' })
  @ApiOkResponse({ description: 'Успешный ответ' })
  @Post('page-visit')
  async postPageVisit(@Body() dto: AnaliticsRequest): Promise<Visitor> {
    return await this.analiticsService.postPageVisit(dto);
  }
}
