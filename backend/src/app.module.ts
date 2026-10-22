import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { RfpLanesModule } from './rfp-lanes/rfp-lanes.module';
import { RfpsModule } from './rfps/rfps.module';
import { TenantsModule } from './tenants/tenants.module';
import { UsersModule } from './users/users.module';
import { Tenant } from './tenants/tenant.entity';
import { TenantMembership } from './tenants/tenant-membership.entity';
import { User } from './users/user.entity';
import { Rfp } from './rfps/rfp.entity';
import { RfpLane } from './rfp-lanes/rfp-lane.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST ?? 'localhost',
      port: Number(process.env.DATABASE_PORT ?? 5432),
      username: process.env.DATABASE_USER ?? 'interview_user',
      password: process.env.DATABASE_PASSWORD ?? 'interview_password',
      database: process.env.DATABASE_NAME ?? 'interview_test',
      synchronize: false,
      autoLoadEntities: true,
      entities: [Tenant, TenantMembership, User, Rfp, RfpLane],
    }),
    HealthModule,
    UsersModule,
    TenantsModule,
    AuthModule,
    RfpsModule,
    RfpLanesModule,
  ],
})
export class AppModule {}
