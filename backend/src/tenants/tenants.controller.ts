import { Controller, Get, UseGuards } from '@nestjs/common';
import { User } from '../users/user.entity';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TenantsService } from './tenants.service';

@Controller('tenants')
@UseGuards(JwtAuthGuard)
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Get()
  findForCurrentUser(@CurrentUser() user: User) {
    return this.tenantsService.findForUser(user.id);
  }
}
