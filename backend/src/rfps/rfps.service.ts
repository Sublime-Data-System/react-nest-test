import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateRfpStatusDto } from './dto/update-rfp-status.dto';
import { Rfp } from './rfp.entity';

@Injectable()
export class RfpsService {
  constructor(
    @InjectRepository(Rfp)
    private readonly rfpsRepository: Repository<Rfp>,
  ) {}

  findAllForTenant(tenantId: string) {
    return this.rfpsRepository.find({
      where: { tenantId },
      order: { dueDate: 'ASC', title: 'ASC' },
    });
  }

  async findOneForTenant(tenantId: string, rfpId: string) {
    const rfp = await this.rfpsRepository.findOne({
      where: { id: rfpId, tenantId },
    });

    if (!rfp) {
      throw new NotFoundException('RFP not found');
    }

    return rfp;
  }

  async updateStatus(tenantId: string, rfpId: string, dto: UpdateRfpStatusDto) {
    const rfp = await this.findOneForTenant(tenantId, rfpId);
    rfp.status = dto.status;
    return this.rfpsRepository.save(rfp);
  }
}
