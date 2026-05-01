import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { JwtStrategy } from './jwt.strategy';

describe('JwtStrategy', () => {
  it('validate delegates to AuthService', async () => {
    const authService = {
      validate: jest.fn().mockResolvedValue({ id: '1', role: 'USER' }),
    };
    const configService = {
      getOrThrow: jest.fn().mockReturnValue('jwt-secret-at-least-32-characters'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        { provide: AuthService, useValue: authService },
        { provide: ConfigService, useValue: configService },
      ],
    }).compile();

    const strategy = module.get(JwtStrategy);
    const user = await strategy.validate({ id: 'u1' });

    expect(authService.validate).toHaveBeenCalledWith('u1');
    expect(user).toEqual({ id: '1', role: 'USER' });
  });
});
