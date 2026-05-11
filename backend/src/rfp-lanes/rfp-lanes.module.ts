import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TenantsModule } from '../tenants/tenants.module';
import { RfpLane } from './rfp-lane.entity';
import { RfpLanesController } from './rfp-lanes.controller';
import { RfpLanesService } from './rfp-lanes.service';

@Module({
  imports: [TypeOrmModule.forFeature([RfpLane]), TenantsModule],
  controllers: [RfpLanesController],
  providers: [RfpLanesService],
  exports: [RfpLanesService, TypeOrmModule],
})
export class RfpLanesModule {}
