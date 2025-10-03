import { ApiProperty } from '@nestjs/swagger';

export class StatsDto {
  @ApiProperty({ example: '/home', description: 'URL страницы' })
  url: string;

  @ApiProperty({ example: 100, description: 'Количество просмотров' })
  views: number;
}
