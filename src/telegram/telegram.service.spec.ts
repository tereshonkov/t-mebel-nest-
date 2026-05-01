import { ConfigService } from '@nestjs/config';
import type { Telegraf } from 'telegraf';
import { TelegramService } from './telegram.service';

describe('TelegramService', () => {
  it('sendMessage forwards to bot', async () => {
    const sendMessage = jest.fn().mockResolvedValue(undefined);
    const bot = {
      telegram: { sendMessage },
    } as unknown as Telegraf;

    const configService = {
      get: jest.fn((key: string) =>
        key === 'TELEGRAM_BOT_TOKEN'
          ? 'token'
          : key === 'TELEGRAM_CHAT_ID'
            ? '-100123'
            : undefined,
      ),
    } as unknown as ConfigService;

    const service = new TelegramService(bot, configService);
    await service.sendMessage({ message: 'hello' });

    expect(sendMessage).toHaveBeenCalledWith('-100123', 'hello');
  });

  it('skips chat id init when token absent', () => {
    const bot = {
      telegram: { sendMessage: jest.fn() },
    } as unknown as Telegraf;

    const configService = {
      get: jest.fn().mockReturnValue(undefined),
    } as unknown as ConfigService;

    expect(() => new TelegramService(bot, configService)).not.toThrow();
  });
});
