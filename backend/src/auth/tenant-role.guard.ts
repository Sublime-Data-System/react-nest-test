import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthenticatedRequest } from '../common/authenticated-request';
import { TenantRole } from '../tenants/tenant-role.enum';
import { TENANT_ROLES_KEY } from './tenant-roles.decorator';

@Injectable()
export class TenantRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<TenantRole[]>(
      TENANT_ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!roles?.length) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const role = request.tenantMembership?.role;

    if (!role || !roles.includes(role)) {
      throw new ForbiddenException('This action requires an admin role');
    }

    return true;
  }
}
