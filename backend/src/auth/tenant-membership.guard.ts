import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { TenantsService } from '../tenants/tenants.service';
import { AuthenticatedRequest } from '../common/authenticated-request';

@Injectable()
export class TenantMembershipGuard implements CanActivate {
  constructor(private readonly tenantsService: TenantsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const tenantId = request.params.tenantId;

    if (!request.user || typeof tenantId !== 'string') {
      throw new ForbiddenException('Tenant membership is required');
    }

    const membership = await this.tenantsService.findMembership(
      tenantId,
      request.user.id,
    );

    if (!membership) {
      throw new ForbiddenException('You do not have access to this tenant');
    }

    request.tenantMembership = membership;
    return true;
  }
}
