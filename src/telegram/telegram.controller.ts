import { Controller } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { Post, Body } from '@nestjs/common';
import { TelegramRequest } from './dto/telegram.dto';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';

@Controller('telegram')
export class TelegramController {
  constructor(private readonly telegramService: TelegramService) {}

  @ApiOperation({ summary: 'Отправить сообщение в Telegram' })
  @ApiOkResponse({ description: 'Сообщение успешно отправлено' })
  @ApiBadRequestResponse({ description: 'Ошибка при отправке сообщения' })
  @Post('send-message')
  async sendMessage(@Body() dto: TelegramRequest) {
    await this.telegramService.sendMessage({ message: dto.message });
  }
}
