import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AnaliticsRequest {
  @ApiProperty({
    example: '192.168.0.1',
    description: 'IP адрес посетителя',
  })
  @IsString()
  ip?: string;

  @ApiProperty({
    example:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    description: 'User Agent посетителя',
  })
  @IsString()
  @IsNotEmpty()
  userAgent: string;

  @ApiProperty({
    example: '2023-10-01T12:34:56.789Z',
    description: 'Дата и время создания записи',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2023-10-02T12:34:56.789Z',
    description: 'Дата и время последнего обновления записи',
  })
  updatedAt: Date;

  @ApiProperty({
    example: [
      { url: '/home', createdAt: '2023-10-01T12:34:56.789Z' },
      { url: '/products', createdAt: '2023-10-01T13:00:00.000Z' },
    ],
    description: 'Список посещенных страниц',
  })
  visits: { url: string; createdAt: Date }[];

  @ApiProperty({
    example: [
      { id: 'call-123', createdAt: '2023-10-01T14:00:00.000Z' },
      { id: 'call-456', createdAt: '2023-10-01T15:30:00.000Z' },
    ],
    description: 'Список совершенных звонков',
  })
  called: { id: string; createdAt: Date }[];
}
