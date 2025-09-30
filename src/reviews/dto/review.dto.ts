import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class ReviewRequest {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Great product!' })
  @IsString()
  @IsNotEmpty()
  text: string;

  @IsBoolean()
  isApproved: boolean;

  @ApiProperty({ example: 'product-id-123' })
  @IsNotEmpty()
  @IsString()
  productId: string;
}
