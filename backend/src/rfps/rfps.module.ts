import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TenantsModule } from '../tenants/tenants.module';
import { Rfp } from './rfp.entity';
import { RfpsController } from './rfps.controller';
import { RfpsService } from './rfps.service';

@Module({
  imports: [TypeOrmModule.forFeature([Rfp]), TenantsModule],
  controllers: [RfpsController],
  providers: [RfpsService],
  exports: [RfpsService, TypeOrmModule],
})
export class RfpsModule {}
