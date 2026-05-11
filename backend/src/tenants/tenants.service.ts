import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TenantMembership } from './tenant-membership.entity';
import { Tenant } from './tenant.entity';

@Injectable()
export class TenantsService {
  constructor(
    @InjectRepository(Tenant)
    private readonly tenantsRepository: Repository<Tenant>,
    @InjectRepository(TenantMembership)
    private readonly membershipsRepository: Repository<TenantMembership>,
  ) {}

  async findForUser(userId: string) {
    const memberships = await this.membershipsRepository.find({
      where: { userId },
      relations: { tenant: true },
      order: { tenant: { name: 'ASC' } },
    });

    return memberships.map((membership) => ({
      id: membership.tenant.id,
      name: membership.tenant.name,
      slug: membership.tenant.slug,
      role: membership.role,
    }));
  }

  findMembership(tenantId: string, userId: string) {
    return this.membershipsRepository.findOne({
      where: { tenantId, userId },
      relations: { tenant: true, user: true },
    });
  }
}
