import { ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TenantRole } from '../tenants/tenant-role.enum';
import { TENANT_ROLES_KEY } from './tenant-roles.decorator';
import { TenantRoleGuard } from './tenant-role.guard';

function createContext(role?: TenantRole) {
  return {
    getHandler: () => 'handler',
    getClass: () => 'class',
    switchToHttp: () => ({
      getRequest: () => ({
        tenantMembership: role ? { role } : undefined,
      }),
    }),
  } as never;
}

describe('TenantRoleGuard', () => {
  it('allows requests when no role metadata is required', () => {
    const reflector = {
      getAllAndOverride: jest.fn().mockReturnValue(undefined),
    } as unknown as Reflector;
    const guard = new TenantRoleGuard(reflector);

    expect(guard.canActivate(createContext())).toBe(true);
  });

  it('allows tenant admins for admin routes', () => {
    const reflector = {
      getAllAndOverride: jest.fn().mockReturnValue([TenantRole.Admin]),
    } as unknown as Reflector;
    const guard = new TenantRoleGuard(reflector);

    expect(guard.canActivate(createContext(TenantRole.Admin))).toBe(true);
    expect(reflector.getAllAndOverride).toHaveBeenCalledWith(TENANT_ROLES_KEY, [
      'handler',
      'class',
    ]);
  });

  it('rejects normal users for admin routes', () => {
    const reflector = {
      getAllAndOverride: jest.fn().mockReturnValue([TenantRole.Admin]),
    } as unknown as Reflector;
    const guard = new TenantRoleGuard(reflector);

    expect(() => guard.canActivate(createContext(TenantRole.User))).toThrow(
      ForbiddenException,
    );
  });
});
