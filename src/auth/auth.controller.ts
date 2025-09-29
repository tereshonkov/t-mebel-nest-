import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Get, Req, Res } from '@nestjs/common';
import type { RequestWithCookies } from './interfaces/cookie.interface';
import { UnauthorizedException } from '@nestjs/common';
import type { Response } from 'express';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';

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

    res.cookie('refreshToken', tokens?.refreshToken, { httpOnly: true });
    return tokens;
  }
}
