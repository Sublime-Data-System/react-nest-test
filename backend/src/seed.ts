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

// Each tenant gets its own city pairs so cross-tenant leaks are obvious in the UI.
const acmeLanes = [
  ['Chicago', 'IL', 'Dallas', 'TX', 'Dry Van', 120, RfpLaneStatus.Open],
  ['Atlanta', 'GA', 'Miami', 'FL', 'Reefer', 80, RfpLaneStatus.Awarded],
  ['Seattle', 'WA', 'Denver', 'CO', 'Flatbed', 45, RfpLaneStatus.Closed],
  ['Boston', 'MA', 'Newark', 'NJ', 'Dry Van', 60, RfpLaneStatus.Open],
  ['Phoenix', 'AZ', 'Las Vegas', 'NV', 'Reefer', 35, RfpLaneStatus.Awarded],
  ['Minneapolis', 'MN', 'Kansas City', 'MO', 'Dry Van', 90, RfpLaneStatus.Closed],
  ['Portland', 'OR', 'Boise', 'ID', 'Flatbed', 52, RfpLaneStatus.Open],
  ['San Diego', 'CA', 'Tucson', 'AZ', 'Power Only', 40, RfpLaneStatus.Awarded],
  ['Columbus', 'OH', 'Charlotte', 'NC', 'Dry Van', 110, RfpLaneStatus.Closed],
  ['Nashville', 'TN', 'Orlando', 'FL', 'Reefer', 72, RfpLaneStatus.Open],
  ['Salt Lake City', 'UT', 'Reno', 'NV', 'Flatbed', 58, RfpLaneStatus.Awarded],
  ['Detroit', 'MI', 'Pittsburgh', 'PA', 'Power Only', 66, RfpLaneStatus.Closed],
  ['Houston', 'TX', 'New Orleans', 'LA', 'Dry Van', 95, RfpLaneStatus.Open],
  ['St. Louis', 'MO', 'Indianapolis', 'IN', 'Reefer', 84, RfpLaneStatus.Awarded],
  ['Cleveland', 'OH', 'Buffalo', 'NY', 'Flatbed', 43, RfpLaneStatus.Closed],
  ['Richmond', 'VA', 'Raleigh', 'NC', 'Power Only', 38, RfpLaneStatus.Open],
  ['Omaha', 'NE', 'Des Moines', 'IA', 'Dry Van', 74, RfpLaneStatus.Awarded],
  ['Memphis', 'TN', 'Little Rock', 'AR', 'Reefer', 68, RfpLaneStatus.Closed],
  ['Los Angeles', 'CA', 'Fresno', 'CA', 'Flatbed', 57, RfpLaneStatus.Open],
  ['San Antonio', 'TX', 'Oklahoma City', 'OK', 'Power Only', 48, RfpLaneStatus.Awarded],
  ['Cincinnati', 'OH', 'Louisville', 'KY', 'Dry Van', 77, RfpLaneStatus.Closed],
  ['Jacksonville', 'FL', 'Savannah', 'GA', 'Reefer', 63, RfpLaneStatus.Open],
  ['Albuquerque', 'NM', 'El Paso', 'TX', 'Flatbed', 54, RfpLaneStatus.Awarded],
  ['Milwaukee', 'WI', 'Grand Rapids', 'MI', 'Power Only', 49, RfpLaneStatus.Closed],
  ['Kansas City', 'MO', 'Tulsa', 'OK', 'Dry Van', 88, RfpLaneStatus.Open],
  ['Philadelphia', 'PA', 'Baltimore', 'MD', 'Reefer', 70, RfpLaneStatus.Awarded],
  ['Sacramento', 'CA', 'Spokane', 'WA', 'Flatbed', 61, RfpLaneStatus.Closed],
  ['Tampa', 'FL', 'Birmingham', 'AL', 'Power Only', 44, RfpLaneStatus.Open],
  ['Fort Worth', 'TX', 'Shreveport', 'LA', 'Dry Van', 82, RfpLaneStatus.Awarded],
  ['Madison', 'WI', 'Sioux Falls', 'SD', 'Reefer', 59, RfpLaneStatus.Closed],
  ['Rochester', 'NY', 'Hartford', 'CT', 'Flatbed', 46, RfpLaneStatus.Open],
  ['Fargo', 'ND', 'Billings', 'MT', 'Power Only', 36, RfpLaneStatus.Awarded],
  ['Norfolk', 'VA', 'Charleston', 'SC', 'Dry Van', 91, RfpLaneStatus.Closed],
  ['Bakersfield', 'CA', 'Yuma', 'AZ', 'Reefer', 55, RfpLaneStatus.Open],
  ['Toledo', 'OH', 'Fort Wayne', 'IN', 'Flatbed', 47, RfpLaneStatus.Awarded],
  ['Wichita', 'KS', 'Amarillo', 'TX', 'Power Only', 39, RfpLaneStatus.Closed],
] as const;

const bluebirdLanes = [
  ['Austin', 'TX', 'Laredo', 'TX', 'Reefer', 64, RfpLaneStatus.Open],
  ['Mobile', 'AL', 'Jackson', 'MS', 'Dry Van', 52, RfpLaneStatus.Awarded],
  ['Baton Rouge', 'LA', 'Lafayette', 'LA', 'Flatbed', 41, RfpLaneStatus.Closed],
  ['Knoxville', 'TN', 'Chattanooga', 'TN', 'Reefer', 73, RfpLaneStatus.Open],
  ['Lexington', 'KY', 'Dayton', 'OH', 'Dry Van', 58, RfpLaneStatus.Awarded],
  ['Columbia', 'SC', 'Augusta', 'GA', 'Power Only', 37, RfpLaneStatus.Closed],
  ['Greenville', 'SC', 'Durham', 'NC', 'Reefer', 86, RfpLaneStatus.Open],
  ['Tallahassee', 'FL', 'Pensacola', 'FL', 'Flatbed', 33, RfpLaneStatus.Awarded],
  ['Gainesville', 'FL', 'Fort Myers', 'FL', 'Reefer', 92, RfpLaneStatus.Closed],
  ['Wilmington', 'NC', 'Roanoke', 'VA', 'Dry Van', 47, RfpLaneStatus.Open],
  ['Harrisburg', 'PA', 'Allentown', 'PA', 'Power Only', 51, RfpLaneStatus.Awarded],
  ['Scranton', 'PA', 'Albany', 'NY', 'Reefer', 69, RfpLaneStatus.Closed],
  ['Syracuse', 'NY', 'Burlington', 'VT', 'Flatbed', 34, RfpLaneStatus.Open],
  ['Providence', 'RI', 'Worcester', 'MA', 'Dry Van', 78, RfpLaneStatus.Awarded],
  ['Manchester', 'NH', 'Portland', 'ME', 'Reefer', 42, RfpLaneStatus.Closed],
  ['Akron', 'OH', 'Lansing', 'MI', 'Power Only', 56, RfpLaneStatus.Open],
  ['Flint', 'MI', 'Peoria', 'IL', 'Dry Van', 63, RfpLaneStatus.Awarded],
  ['Rockford', 'IL', 'Green Bay', 'WI', 'Reefer', 71, RfpLaneStatus.Closed],
  ['Duluth', 'MN', 'Cedar Rapids', 'IA', 'Flatbed', 38, RfpLaneStatus.Open],
  ['Davenport', 'IA', 'Lincoln', 'NE', 'Dry Van', 67, RfpLaneStatus.Awarded],
  ['Topeka', 'KS', 'Joplin', 'MO', 'Power Only', 45, RfpLaneStatus.Closed],
  ['Fayetteville', 'AR', 'Fort Smith', 'AR', 'Reefer', 53, RfpLaneStatus.Open],
  ['Santa Fe', 'NM', 'Las Cruces', 'NM', 'Flatbed', 32, RfpLaneStatus.Awarded],
  ['Flagstaff', 'AZ', 'Mesa', 'AZ', 'Reefer', 76, RfpLaneStatus.Closed],
  ['Ogden', 'UT', 'Provo', 'UT', 'Dry Van', 49, RfpLaneStatus.Open],
  ['Cheyenne', 'WY', 'Casper', 'WY', 'Flatbed', 31, RfpLaneStatus.Awarded],
  ['Rapid City', 'SD', 'Bismarck', 'ND', 'Power Only', 35, RfpLaneStatus.Closed],
  ['Missoula', 'MT', 'Yakima', 'WA', 'Reefer', 44, RfpLaneStatus.Open],
  ['Eugene', 'OR', 'Medford', 'OR', 'Dry Van', 57, RfpLaneStatus.Awarded],
  ['Tacoma', 'WA', 'Eugene', 'OR', 'Reefer', 81, RfpLaneStatus.Closed],
  ['Modesto', 'CA', 'Stockton', 'CA', 'Flatbed', 39, RfpLaneStatus.Open],
  ['Riverside', 'CA', 'Oxnard', 'CA', 'Reefer', 93, RfpLaneStatus.Awarded],
  ['Lubbock', 'TX', 'Corpus Christi', 'TX', 'Power Only', 50, RfpLaneStatus.Closed],
] as const;

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
    lanes: acmeLanes,
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
    lanes: bluebirdLanes,
  },
];

const lanesPerRfp = 30;

// Due dates are relative to the seed run so RFPs never look stale.
function dueDateFromToday(daysAhead: number) {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + daysAhead);
  return date.toISOString().slice(0, 10);
}

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
            dueDate: dueDateFromToday((rfpIndex + 1) * 30),
          }),
        );
      }

      const laneOffset = rfpIndex * 3;
      for (const laneInput of tenantInput.lanes.slice(
        laneOffset,
        laneOffset + lanesPerRfp,
      )) {
        const [originCity, originState, destinationCity, destinationState] = laneInput;
        const existingLane = await laneRepository.findOne({
          where: {
            tenantId: tenant.id,
            rfpId: rfp.id,
            originCity,
            originState,
            destinationCity,
            destinationState,
            equipmentType: laneInput[4],
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
              status: laneInput[6],
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
