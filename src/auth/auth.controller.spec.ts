import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import type { Response } from 'express';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: {
    refresh: jest.Mock;
    setCookie: jest.Mock;
    login: jest.Mock;
    register: jest.Mock;
    logout: jest.Mock;
  };

  beforeEach(async () => {
    authService = {
      refresh: jest.fn(),
      setCookie: jest.fn(),
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn().mockReturnValue(true),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authService }],
    }).compile();

    controller = module.get(AuthController);
  });

  it('refresh throws without cookie', async () => {
    await expect(
      controller.refresh({ cookies: {} } as never, {} as Response),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('refresh sets cookie and returns tokens', async () => {
    authService.refresh.mockResolvedValue({
      accessToken: 'a',
      refreshToken: 'r',
    });
    const res = {
      cookie: jest.fn(),
    } as unknown as Response;

    const out = await controller.refresh(
      { cookies: { refreshToken: 'old' } } as never,
      res,
    );

    expect(out).toEqual({ accessToken: 'a', refreshToken: 'r' });
    expect(authService.setCookie).toHaveBeenCalled();
  });
});
