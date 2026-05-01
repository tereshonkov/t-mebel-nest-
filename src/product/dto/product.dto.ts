import { Category } from '@prisma/client';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsArray,
  IsOptional,
} from 'class-validator';
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
  furnitures: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  category: Category;

  @ApiProperty({
    description: 'IDs of images',
    type: [String],
    required: false,
  })
  @IsArray()
  @IsOptional()
  images?: { url: string }[];
}
