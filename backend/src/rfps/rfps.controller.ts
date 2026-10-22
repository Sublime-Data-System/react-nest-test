import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TenantMembershipGuard } from '../auth/tenant-membership.guard';
import { TenantRoleGuard } from '../auth/tenant-role.guard';
import { TenantRoles } from '../auth/tenant-roles.decorator';
import { TenantRole } from '../tenants/tenant-role.enum';
import { UpdateRfpStatusDto } from './dto/update-rfp-status.dto';
import { RfpsService } from './rfps.service';

@Controller('tenants/:tenantId/rfps')
@UseGuards(JwtAuthGuard, TenantMembershipGuard)
export class RfpsController {
  constructor(private readonly rfpsService: RfpsService) {}

  @Get()
  findAll(@Param('tenantId') tenantId: string) {
    return this.rfpsService.findAllForTenant(tenantId);
  }

  @Get(':rfpId')
  findOne(@Param('tenantId') tenantId: string, @Param('rfpId') rfpId: string) {
    return this.rfpsService.findOneForTenant(tenantId, rfpId);
  }

  @Patch(':rfpId/status')
  @UseGuards(TenantRoleGuard)
  @TenantRoles(TenantRole.Admin)
  updateStatus(
    @Param('tenantId') tenantId: string,
    @Param('rfpId') rfpId: string,
    @Body() dto: UpdateRfpStatusDto,
  ) {
    return this.rfpsService.updateStatus(tenantId, rfpId, dto);
  }
}
