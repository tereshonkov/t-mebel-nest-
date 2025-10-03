import { Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Get, Req, Res, Body } from '@nestjs/common';
import type { RequestWithCookies } from './interfaces/cookie.interface';
import { UnauthorizedException } from '@nestjs/common';
import type { Response } from 'express';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { LoginRequest } from './dto/login.dto';
import { RegisterRequest } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'Обновление accessToken и refreshToken',
    description:
      'Обновление accessToken и refreshToken по refreshToken из httpOnly cookie',
  })
  @ApiOkResponse({ description: 'Токены успешно обновлены' })
  @ApiBadRequestResponse({ description: 'Пользователь не авторизирован' })
  @Get('refresh')
  async refresh(
    @Req() req: RequestWithCookies,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies['refreshToken'];

    if (!refreshToken) {
      throw new UnauthorizedException('Пользователь не авторизирован');
    }

    const tokens = await this.authService.refresh(refreshToken);

    res.cookie('refreshToken', tokens?.refreshToken);
    return tokens;
  }

  @ApiOperation({
    summary: 'Авторизация пользователя',
    description: 'Авторизация пользователя по email и паролю',
  })
  @ApiOkResponse({ description: 'Пользователь успешно авторизован' })
  @ApiBadRequestResponse({ description: 'Неверные данные авторизации' })
  @ApiNotFoundResponse({ description: 'Пользователь не найден' })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Res({ passthrough: true }) res: Response,
    @Body() dto: LoginRequest,
  ) {
    return this.authService.login(res, dto);
  }

  @ApiOperation({
    summary: 'Регистрация пользователя',
    description: 'Регистрация пользователя по имени, email и паролю',
  })
  @ApiOkResponse({ description: 'Пользователь успешно зарегистрирован' })
  @ApiBadRequestResponse({ description: 'Неверные данные регистрации' })
  @Post('register')
  async register(
    @Res({ passthrough: true }) res: Response,
    @Body() dto: RegisterRequest,
  ) {
    const user = await this.authService.register(res, dto);
    return user;
  }

  @ApiOperation({
    summary: 'Выход из системы',
    description: 'Выход из системы и удаление refreshToken из httpOnly cookie',
  })
  @ApiOkResponse({ description: 'Пользователь успешно вышел из системы' })
  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    return this.authService.logout(res);
  }
}
