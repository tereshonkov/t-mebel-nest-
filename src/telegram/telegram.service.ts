import { Injectable } from '@nestjs/common';
import { InjectBot } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';
import { ConfigService } from '@nestjs/config';
import { TelegramRequest } from './dto/telegram.dto';

@Injectable()
export class TelegramService {
  private chatId: string;

  constructor(
    @InjectBot() private readonly bot: Telegraf,
    private readonly configService: ConfigService,
  ) {
    if (process.env.NODE_ENV !== 'dev') {
      // не инициализируем бота локально
      return;
    }

    this.chatId = this.configService.get<string>('TELEGRAM_CHAT_ID') ?? '';
    if (!this.chatId) {
      throw new Error('TELEGRAM_CHAT_ID не найден в файле .env');
    }
  }

  async sendMessage(dto: TelegramRequest) {
    await this.bot.telegram.sendMessage(this.chatId, dto.message);
  }
}
