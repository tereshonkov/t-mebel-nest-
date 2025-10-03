import { ApiProperty } from '@nestjs/swagger';

export class ClickRequest {
  @ApiProperty({
    example: 'visitor-123',
    description: 'Уникальный идентификатор посетителя',
  })
  visitorId?: string;
}
