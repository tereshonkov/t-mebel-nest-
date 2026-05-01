import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { RoleGuard } from './role.guard';

describe('RoleGuard', () => {
  const ctx = (user: { role: Role } | undefined): ExecutionContext =>
    ({
      getHandler: () => ({}),
      switchToHttp: () => ({
        getRequest: () => ({ user }),
      }),
    }) as unknown as ExecutionContext;

  it('allows when no roles metadata', () => {
    const reflector = { get: jest.fn().mockReturnValue(undefined) };
    const guard = new RoleGuard(reflector as unknown as Reflector);
    expect(guard.canActivate(ctx(undefined))).toBe(true);
  });

  it('denies when user missing', () => {
    const reflector = { get: jest.fn().mockReturnValue([Role.ADMIN]) };
    const guard = new RoleGuard(reflector as unknown as Reflector);
    expect(guard.canActivate(ctx(undefined))).toBe(false);
  });

  it('allows matching role', () => {
    const reflector = { get: jest.fn().mockReturnValue([Role.ADMIN]) };
    const guard = new RoleGuard(reflector as unknown as Reflector);
    expect(
      guard.canActivate(ctx({ role: Role.ADMIN })),
    ).toBe(true);
  });

  it('denies non-matching role', () => {
    const reflector = { get: jest.fn().mockReturnValue([Role.ADMIN]) };
    const guard = new RoleGuard(reflector as unknown as Reflector);
    expect(guard.canActivate(ctx({ role: Role.USER }))).toBe(false);
  });
});
