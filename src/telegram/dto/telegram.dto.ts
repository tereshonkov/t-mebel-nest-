import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class TelegramRequest {
  @ApiProperty({
    description: 'Сообщение для отправки в Telegram',
    example: 'Привет, Telegram!',
  })
  @IsString()
  @IsNotEmpty()
  message: string;
}
