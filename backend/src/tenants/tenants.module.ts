import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TenantMembershipGuard } from '../auth/tenant-membership.guard';
import { TenantRoleGuard } from '../auth/tenant-role.guard';
import { TenantMembership } from './tenant-membership.entity';
import { Tenant } from './tenant.entity';
import { TenantsController } from './tenants.controller';
import { TenantsService } from './tenants.service';

@Module({
  imports: [TypeOrmModule.forFeature([Tenant, TenantMembership])],
  controllers: [TenantsController],
  providers: [TenantsService, TenantMembershipGuard, TenantRoleGuard],
  exports: [TenantsService, TypeOrmModule, TenantMembershipGuard, TenantRoleGuard],
})
export class TenantsModule {}
