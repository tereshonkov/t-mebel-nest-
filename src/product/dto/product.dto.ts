import { Category } from '@prisma/client';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ProductRequest {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  color: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  furnitures: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  width: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  height: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  rating: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  category: Category;
}
