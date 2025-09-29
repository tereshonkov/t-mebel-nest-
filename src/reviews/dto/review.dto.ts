import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class ReviewRequest {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  text: string;

  @IsBoolean()
  isApproved: boolean;

  @IsNotEmpty()
  @IsString()
  productId: string;
}
