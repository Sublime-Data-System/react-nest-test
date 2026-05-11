import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { Tenant } from './tenants/tenant.entity';
import { User } from './users/user.entity';
import { TenantMembership } from './tenants/tenant-membership.entity';
import { Rfp } from './rfps/rfp.entity';
import { RfpLane } from './rfp-lanes/rfp-lane.entity';

config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST ?? 'localhost',
  port: Number(process.env.DATABASE_PORT ?? 5432),
  username: process.env.DATABASE_USER ?? 'interview_user',
  password: process.env.DATABASE_PASSWORD ?? 'interview_password',
  database: process.env.DATABASE_NAME ?? 'interview_test',
  synchronize: false,
  migrationsRun: false,
  logging: false,
  entities: [Tenant, User, TenantMembership, Rfp, RfpLane],
  migrations: ['src/migrations/*.ts'],
});
