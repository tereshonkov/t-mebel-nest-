import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ClickRequest {
  @ApiProperty({
    example: 'visitor-123',
    description: 'Уникальный идентификатор посетителя',
  })
  @IsString()
  @IsNotEmpty()
  visitorId: string;
}
