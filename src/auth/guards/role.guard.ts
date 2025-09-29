import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRequest } from '../../user/dto/user.dto';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requireRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );

    if (!requireRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest<{ user: UserRequest }>();
    const user = request.user;

    return !!user && requireRoles.includes(user.role);
  }
}
