import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { Response, Request } from 'express';
import { LoginRequest } from './dto/login.dto';
import { RegisterRequest } from './dto/register.dto';
import { hash, verify } from 'argon2';
import { JwtPayload } from './interfaces/jwt.interfaces';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  private readonly JWT_ACCESS_TOKEN_TTL: string;
  private readonly JWT_REFRESH_TOKEN_TTL: string;
  private readonly COOKIE_DOMAIN: string;

  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    this.COOKIE_DOMAIN = this.configService.getOrThrow<string>('COOKIE_DOMAIN');
    this.JWT_ACCESS_TOKEN_TTL = this.configService.getOrThrow<string>(
      'JWT_ACCESS_TOKEN_TTL',
    );
    this.JWT_REFRESH_TOKEN_TTL = this.configService.getOrThrow<string>(
      'JWT_REFRESH_TOKEN_TTL',
    );
  }

  async register(res: Response, dto: RegisterRequest) {
    const { name, email, password } = dto;

    const existUser = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });
    if (existUser) {
      throw new ConflictException('Такой пользователь уже существует!');
    }

    const user = await this.prismaService.user.create({
      data: {
        name,
        email,
        password: await hash(password),
      },
    });
    return this.auth(res, user.id);
  }

  async login(res: Response, dto: LoginRequest) {
    const { email, password } = dto;
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        role: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    const isValidePassword = await verify(user.password, password);

    if (!isValidePassword) {
      throw new NotFoundException('Пользователь не найден');
    }

    return this.auth(res, user.id);
  }

  private generateToken(id: string) {
    const payload: JwtPayload = { id };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.JWT_ACCESS_TOKEN_TTL,
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.JWT_REFRESH_TOKEN_TTL,
    });
    return { accessToken, refreshToken };
  }

  extractIdFromToken(token: string): string {
    const payload = this.jwtService.decode<{ id: string }>(token);
    if (!payload || !payload.id)
      throw new UnauthorizedException('Пользователь не авторизирован');
    return payload.id;
  }

  async refresh(refreshToken: string) {
    const payload: JwtPayload = this.jwtService.verify(refreshToken);

    if (payload) {
      const user = await this.prismaService.user.findUnique({
        where: {
          id: payload.id,
        },
        select: {
          id: true,
        },
      });

      if (!user) {
        throw new UnauthorizedException('Пользователь не авторизирован');
      }

      return this.generateToken(user.id);
    }
  }

  logout(res: Response) {
    this.setCookie(res, '', new Date());
    return true;
  }

  public async validate(id: string): Promise<User> {
    const user: User | null = await this.prismaService.user.findUnique({
      where: {
        id,
      },
    });
    if (!user) {
      throw new UnauthorizedException('Пользователь не авторизирован');
    }
    return user;
  }

  private setCookie(res: Response, value: string, expires: Date) {
    res.cookie('refreshToken', value, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      domain:
        this.COOKIE_DOMAIN !== 'localhost' ? this.COOKIE_DOMAIN : undefined,
      expires,
    });
  }

  private auth(res: Response, id: string) {
    const { accessToken, refreshToken } = this.generateToken(id);
    this.setCookie(
      res,
      refreshToken,
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    );
    return accessToken;
  }
}
