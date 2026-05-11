import { Request } from 'express';
import { TenantMembership } from '../tenants/tenant-membership.entity';
import { User } from '../users/user.entity';

export interface AuthenticatedRequest extends Request {
  user: User;
  tenantMembership?: TenantMembership;
}
