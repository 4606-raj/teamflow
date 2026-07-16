import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Permission } from '@/common/enums/permission.enum';
import { SystemRole } from '@prisma/client';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean {

    const requiredPermissions =
      this.reflector.getAllAndOverride<Permission[]>(
        'permissions',
        [
          context.getHandler(),
          context.getClass(),
        ],
      );

    // Endpoint has no permission restriction
    if (!requiredPermissions?.length) {
      return true;
    }

    const request =
      context.switchToHttp().getRequest();

    const user = request.user;

    if (!user) {
      throw new ForbiddenException(
        'User not authenticated',
      );
    }

    if(user.systemRole == SystemRole.SUPERADMIN) {
      return true;
    }

    console.log(user)


    const userPermissions =
      user.permissions ?? [];


    const hasAllPermissions =
      requiredPermissions.every(permission =>
        userPermissions.includes(permission),
      );

    if (!hasAllPermissions) {
      throw new ForbiddenException(
        'Insufficient permissions',
      );
    }


    return true;
  }
}