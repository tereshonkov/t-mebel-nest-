import { Category } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class TranslationPayloadDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  titleSeo?: string;
}

export class ProductTranslationsDto {
  @ApiPropertyOptional({ type: TranslationPayloadDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => TranslationPayloadDto)
  uk?: TranslationPayloadDto;

  @ApiPropertyOptional({ type: TranslationPayloadDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => TranslationPayloadDto)
  ru?: TranslationPayloadDto;

  @ApiPropertyOptional({ type: TranslationPayloadDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => TranslationPayloadDto)
  en?: TranslationPayloadDto;
}

export class ProductRequest {
  @ApiProperty({ description: 'Canonical RU fields (legacy columns)' })
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
  category: Category;

  @ApiPropertyOptional({ type: ProductTranslationsDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => ProductTranslationsDto)
  translations?: ProductTranslationsDto;

  @ApiProperty({
    description: 'IDs of images',
    type: [String],
    required: false,
  })
  @IsArray()
  @IsOptional()
  images?: { url: string }[];
}
