jest.mock('argon2', () => ({
  hash: jest.fn().mockResolvedValue('hashed'),
  verify: jest.fn(),
}));

import {
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { hash, verify } from 'argon2';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: {
    user: {
      findUnique: jest.Mock;
      create: jest.Mock;
    };
  };
  let jwtService: {
    sign: jest.Mock;
    verify: jest.Mock;
    decode: jest.Mock;
  };
  let config: { getOrThrow: jest.Mock };

  const mockRes = () => {
    const cookie = jest.fn();
    return {
      cookie,
    } as unknown as import('express').Response;
  };

  beforeEach(async () => {
    prisma = {
      user: {
        findUnique: jest.fn(),
        create: jest.fn(),
      },
    };
    jwtService = {
      sign: jest
        .fn()
        .mockImplementation((payload: object, opts: { expiresIn?: string }) =>
          JSON.stringify({ ...payload, exp: opts?.expiresIn }),
        ),
      verify: jest.fn(),
      decode: jest.fn(),
    };
    config = {
      getOrThrow: jest
        .fn()
        .mockImplementation((key: string) =>
          key === 'COOKIE_DOMAIN'
            ? 'localhost'
            : key === 'JWT_ACCESS_TOKEN_TTL'
              ? '15m'
              : key === 'JWT_REFRESH_TOKEN_TTL'
                ? '7d'
                : '',
        ),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prisma },
        { provide: JwtService, useValue: jwtService },
        { provide: ConfigService, useValue: config },
      ],
    }).compile();

    service = module.get(AuthService);
    jest.mocked(hash).mockResolvedValue('hashed' as never);
    jest.mocked(verify).mockResolvedValue(true as never);
  });

  it('register throws Conflict when user exists', async () => {
    prisma.user.findUnique.mockResolvedValue({ id: '1' });
    await expect(
      service.register(mockRes(), {
        name: 'a',
        email: 'e@e.com',
        password: 'secret12',
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('register creates user and returns access token', async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    prisma.user.create.mockResolvedValue({ id: 'new-id' });
    const res = mockRes();
    const token = await service.register(res, {
      name: 'a',
      email: 'e@e.com',
      password: 'secret12',
    });
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
    expect(prisma.user.create).toHaveBeenCalled();
    expect(res.cookie).toHaveBeenCalled();
  });

  it('login throws when user missing', async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    await expect(
      service.login(mockRes(), { email: 'x@x.com', password: 'secret12' }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('login throws when password invalid', async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: '1',
      name: 'n',
      email: 'e@e.com',
      password: 'hash',
      role: 'USER',
    });
    jest.mocked(verify).mockResolvedValue(false as never);
    await expect(
      service.login(mockRes(), { email: 'e@e.com', password: 'wrong' }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('login returns access token', async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: '1',
      name: 'n',
      email: 'e@e.com',
      password: 'hash',
      role: 'USER',
    });
    jest.mocked(verify).mockResolvedValue(true as never);
    const token = await service.login(mockRes(), {
      email: 'e@e.com',
      password: 'okpass12',
    });
    expect(typeof token).toBe('string');
  });

  it('extractIdFromToken throws when decode empty', () => {
    jwtService.decode.mockReturnValue(null);
    expect(() => service.extractIdFromToken('t')).toThrow(
      UnauthorizedException,
    );
  });

  it('extractIdFromToken returns id', () => {
    jwtService.decode.mockReturnValue({ id: 'uid' });
    expect(service.extractIdFromToken('t')).toBe('uid');
  });

  it('refresh throws Unauthorized when user gone', async () => {
    jwtService.verify.mockReturnValue({ id: 'uid' });
    prisma.user.findUnique.mockResolvedValue(null);
    await expect(service.refresh('tok')).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });

  it('refresh returns token pair', async () => {
    jwtService.verify.mockReturnValue({ id: 'uid' });
    prisma.user.findUnique.mockResolvedValue({ id: 'uid' });
    const pair = await service.refresh('r');
    expect(pair).toMatchObject({
      accessToken: expect.any(String),
      refreshToken: expect.any(String),
    });
  });

  it('validate throws when user missing', async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    await expect(service.validate('x')).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });

  it('validate returns user', async () => {
    const user = {
      id: '1',
      name: 'n',
      email: 'e',
      password: 'p',
      role: 'USER',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    prisma.user.findUnique.mockResolvedValue(user);
    await expect(service.validate('1')).resolves.toEqual(user);
  });

  it('logout clears cookie', () => {
    const res = mockRes();
    expect(service.logout(res)).toBe(true);
    expect(res.cookie).toHaveBeenCalledWith(
      'refreshToken',
      '',
      expect.objectContaining({
        httpOnly: true,
      }),
    );
  });
});
