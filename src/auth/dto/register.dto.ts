import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterRequest {
  @ApiProperty({
    description: 'Имя пользователя',
    example: 'Ivan',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Email пользователя',
    example: 'ivan@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Пароль пользователя',
    example: '123456',
  })
  @IsNotEmpty()
  @MinLength(6, { message: 'Пароль должен содержать не менее 6 символов' })
  password: string;
}
