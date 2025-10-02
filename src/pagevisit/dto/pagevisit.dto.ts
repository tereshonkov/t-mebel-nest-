import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class PageVisitRequest {
  @ApiProperty({
    example: 'visitor-123',
    description: 'Уникальный идентификатор посетителя',
  })
  @IsString()
  @IsNotEmpty()
  visitorId: string;

  @ApiProperty({
    example: '/home',
    description: 'URL посещенной страницы',
  })
  @IsString()
  @IsNotEmpty()
  url: string;
}
