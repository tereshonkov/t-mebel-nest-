import { Controller, UseGuards } from '@nestjs/common';
import { PagevisitService } from './pagevisit.service';
import { PageVisitRequest } from './dto/pagevisit.dto';
import { Post, Body } from '@nestjs/common';
import { PageVisit } from '@prisma/client';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { StatsDto } from './dto/stats.dto';
import { JwtAuthGuard } from 'src/auth/guards/auth.guards';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { Roles } from '../common/role.decorator';
import { Role } from '@prisma/client';

@Controller('pagevisit')
export class PagevisitController {
  constructor(private readonly pagevisitService: PagevisitService) {}

  @ApiOperation({ summary: 'Роут для записи визита страницы' })
  @ApiOkResponse({ description: 'Роут записан успешно!' })
  @ApiBadRequestResponse({ description: 'Некорректные данные' })
  @Post('record')
  async recordPageVisit(@Body() dto: PageVisitRequest): Promise<PageVisit> {
    return await this.pagevisitService.recordPageVisit(dto);
  }

  @ApiOperation({ summary: 'Получить статистику по посещаемым страницам' })
  @ApiOkResponse({ description: 'Успешный ответ' })
  @ApiBadRequestResponse({ description: 'Ошибка запроса' })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  @Post('stats')
  async getPageVisits(): Promise<StatsDto[]> {
    return await this.pagevisitService.getPageVisits();
  }
}
