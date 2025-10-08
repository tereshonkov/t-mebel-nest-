import { ApiProperty } from '@nestjs/swagger';

export class AnaliticsRequest {
  @ApiProperty({
    example: '01.01',
    description: 'Дата в формате ДД.ММ',
  })
  date: string;

  @ApiProperty({
    example: '150',
    description: 'Количество просмотров страницы',
  })
  screenPageViews: string;

  @ApiProperty({
    example: '75',
    description: 'Количество активных пользователей',
  })
  activeUsers: string;

  @ApiProperty({
    example: '50',
    description: 'Количество новых пользователей',
  })
  newUsers: string;
}
