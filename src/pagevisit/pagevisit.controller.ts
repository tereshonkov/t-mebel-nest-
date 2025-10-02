import { Controller } from '@nestjs/common';
import { PagevisitService } from './pagevisit.service';
import { PageVisitRequest } from './dto/pagevisit.dto';
import { Post, Body } from '@nestjs/common';
import { PageVisit } from '@prisma/client';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';

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
}
