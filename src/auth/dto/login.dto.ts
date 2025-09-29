import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginRequest {
  @ApiProperty({
    description: 'Email пользователя',
    example: 'user@example.com',
  })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Пароль пользователя',
    example: 'strongPassword12345',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'Пароль должен содержать не менее 6 символов' })
  password: string;
}
