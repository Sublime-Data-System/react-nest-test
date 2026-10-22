import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RfpLane } from './rfp-lane.entity';

@Injectable()
export class RfpLanesService {
  constructor(
    @InjectRepository(RfpLane)
    private readonly lanesRepository: Repository<RfpLane>,
  ) {}

  findAllForRfp(tenantId: string, rfpId: string) {
    return this.lanesRepository.find({
      where: { tenantId, rfpId },
      order: { originCity: 'ASC', destinationCity: 'ASC' },
    });
  }

  async findOneForTenant(tenantId: string, laneId: string) {
    const lane = await this.lanesRepository.findOne({
      where: { id: laneId, tenantId },
      relations: { rfp: true },
    });

    if (!lane) {
      throw new NotFoundException('RFP lane not found');
    }

    return lane;
  }
}
