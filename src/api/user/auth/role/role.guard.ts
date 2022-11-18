import {
  Injectable,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from '../auth.guard';

import { ROLES_KEY } from './role.decorator';
import { UserRoleEnum } from './role.types';

@Injectable()
export class RolesGuard extends JwtAuthGuard {
  constructor(private reflector: Reflector) {
    super();
  }

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    await super.canActivate(context);

    const requiredRoles = this.reflector.getAllAndOverride<UserRoleEnum[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) {
      return true;
    }
    const { user } = await context.switchToHttp().getRequest();

    const isAllowed = requiredRoles.some((role) => user.role.includes(role));
    if (!isAllowed) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    return;
  }
}
