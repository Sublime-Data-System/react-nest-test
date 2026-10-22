import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TenantMembershipGuard } from '../auth/tenant-membership.guard';
import { RfpLanesService } from './rfp-lanes.service';

@Controller()
@UseGuards(JwtAuthGuard, TenantMembershipGuard)
export class RfpLanesController {
  constructor(private readonly lanesService: RfpLanesService) {}

  @Get('tenants/:tenantId/rfps/:rfpId/lanes')
  findForRfp(
    @Param('tenantId') tenantId: string,
    @Param('rfpId') rfpId: string,
  ) {
    return this.lanesService.findAllForRfp(tenantId, rfpId);
  }

  @Get('tenants/:tenantId/rfp-lanes/:laneId')
  findOne(
    @Param('tenantId') tenantId: string,
    @Param('laneId') laneId: string,
  ) {
    return this.lanesService.findOneForTenant(tenantId, laneId);
  }
}
