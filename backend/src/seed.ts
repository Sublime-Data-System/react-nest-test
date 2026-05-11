import 'reflect-metadata';
import * as bcrypt from 'bcrypt';
import { AppDataSource } from './data-source';
import { RfpLaneStatus } from './rfp-lanes/rfp-lane-status.enum';
import { RfpLane } from './rfp-lanes/rfp-lane.entity';
import { RfpStatus } from './rfps/rfp-status.enum';
import { Rfp } from './rfps/rfp.entity';
import { TenantMembership } from './tenants/tenant-membership.entity';
import { TenantRole } from './tenants/tenant-role.enum';
import { Tenant } from './tenants/tenant.entity';
import { User } from './users/user.entity';

const password = 'Password123!';

const tenants = [
  {
    name: 'Acme Logistics',
    slug: 'acme-logistics',
    users: [
      { email: 'admin@acme.test', fullName: 'Acme Admin', role: TenantRole.Admin },
      { email: 'user@acme.test', fullName: 'Acme User', role: TenantRole.User },
    ],
    rfps: [
      { title: 'Acme Q3 Midwest Bid', customerName: 'Acme Foods' },
      { title: 'Acme Southeast Contract Renewal', customerName: 'Acme Retail' },
    ],
  },
  {
    name: 'Bluebird Freight',
    slug: 'bluebird-freight',
    users: [
      {
        email: 'admin@bluebird.test',
        fullName: 'Bluebird Admin',
        role: TenantRole.Admin,
      },
      { email: 'user@bluebird.test', fullName: 'Bluebird User', role: TenantRole.User },
    ],
    rfps: [
      { title: 'Bluebird Retail Expansion', customerName: 'Bluebird Retail' },
      { title: 'Bluebird Refrigerated Network', customerName: 'Bluebird Cold Chain' },
    ],
  },
];

const lanes = [
  ['Chicago', 'IL', 'Dallas', 'TX', 'Dry Van', 120],
  ['Atlanta', 'GA', 'Miami', 'FL', 'Reefer', 80],
  ['Seattle', 'WA', 'Denver', 'CO', 'Flatbed', 45],
  ['Boston', 'MA', 'Newark', 'NJ', 'Dry Van', 60],
  ['Phoenix', 'AZ', 'Las Vegas', 'NV', 'Reefer', 35],
  ['Minneapolis', 'MN', 'Kansas City', 'MO', 'Dry Van', 90],
] as const;

async function upsertTenant(input: { name: string; slug: string }) {
  const repository = AppDataSource.getRepository(Tenant);
  const existing = await repository.findOne({ where: { slug: input.slug } });

  if (existing) {
    return existing;
  }

  return repository.save(repository.create(input));
}

async function upsertUser(input: { email: string; fullName: string }) {
  const repository = AppDataSource.getRepository(User);
  const existing = await repository.findOne({ where: { email: input.email } });

  if (existing) {
    return existing;
  }

  return repository.save(
    repository.create({
      email: input.email,
      fullName: input.fullName,
      passwordHash: await bcrypt.hash(password, 10),
    }),
  );
}

async function ensureMembership(tenantId: string, userId: string, role: TenantRole) {
  const repository = AppDataSource.getRepository(TenantMembership);
  const existing = await repository.findOne({ where: { tenantId, userId } });

  if (existing) {
    existing.role = role;
    return repository.save(existing);
  }

  return repository.save(repository.create({ tenantId, userId, role }));
}

async function seed() {
  await AppDataSource.initialize();

  const rfpRepository = AppDataSource.getRepository(Rfp);
  const laneRepository = AppDataSource.getRepository(RfpLane);

  for (const tenantInput of tenants) {
    const tenant = await upsertTenant(tenantInput);

    for (const userInput of tenantInput.users) {
      const user = await upsertUser(userInput);
      await ensureMembership(tenant.id, user.id, userInput.role);
    }

    for (const [rfpIndex, rfpInput] of tenantInput.rfps.entries()) {
      let rfp = await rfpRepository.findOne({
        where: { tenantId: tenant.id, title: rfpInput.title },
      });

      if (!rfp) {
        rfp = await rfpRepository.save(
          rfpRepository.create({
            tenantId: tenant.id,
            title: rfpInput.title,
            customerName: rfpInput.customerName,
            status: RfpStatus.Active,
            dueDate: `2026-0${rfpIndex + 6}-15`,
          }),
        );
      }

      const laneOffset = rfpIndex * 3;
      for (const laneInput of lanes.slice(laneOffset, laneOffset + 3)) {
        const [originCity, originState, destinationCity, destinationState] = laneInput;
        const existingLane = await laneRepository.findOne({
          where: {
            tenantId: tenant.id,
            rfpId: rfp.id,
            originCity,
            originState,
            destinationCity,
            destinationState,
          },
        });

        if (!existingLane) {
          await laneRepository.save(
            laneRepository.create({
              tenantId: tenant.id,
              rfpId: rfp.id,
              originCity,
              originState,
              destinationCity,
              destinationState,
              equipmentType: laneInput[4],
              estimatedVolume: laneInput[5],
              status: RfpLaneStatus.Open,
            }),
          );
        }
      }
    }
  }

  await AppDataSource.destroy();
  console.log('Seed complete. Password for all users: Password123!');
}

seed().catch(async (error) => {
  console.error(error);
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
  }
  process.exit(1);
});
