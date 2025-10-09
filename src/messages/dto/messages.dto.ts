import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MessageRequest {
  @ApiProperty({
    description: 'Сообщение для отправки',
    example: 'Привет!',
  })
  @IsString()
  @IsNotEmpty()
  message: string;
  @ApiProperty({
    description: 'Имя отправителя',
    example: 'Иван Иванов',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Телефон отправителя',
    example: '+380631234567',
  })
  @IsString()
  @IsNotEmpty()
  phone: string;
}
