import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Rfp } from '../rfps/rfp.entity';
import { Tenant } from '../tenants/tenant.entity';
import { RfpLaneStatus } from './rfp-lane-status.enum';

@Entity('rfp_lanes')
@Index('idx_rfp_lanes_tenant_id_rfp_id', ['tenantId', 'rfpId'])
export class RfpLane {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'tenant_id' })
  @Index('idx_rfp_lanes_tenant_id')
  tenantId!: string;

  @Column({ name: 'rfp_id' })
  @Index('idx_rfp_lanes_rfp_id')
  rfpId!: string;

  @Column({ name: 'origin_city' })
  originCity!: string;

  @Column({ name: 'origin_state' })
  originState!: string;

  @Column({ name: 'destination_city' })
  destinationCity!: string;

  @Column({ name: 'destination_state' })
  destinationState!: string;

  @Column({ name: 'equipment_type' })
  equipmentType!: string;

  @Column({ name: 'estimated_volume', type: 'integer' })
  estimatedVolume!: number;

  @Column({ type: 'enum', enum: RfpLaneStatus, default: RfpLaneStatus.Open })
  status!: RfpLaneStatus;

  @ManyToOne(() => Tenant, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenant_id', foreignKeyConstraintName: 'fk_rfp_lanes_tenant' })
  tenant!: Tenant;

  @ManyToOne(() => Rfp, (rfp) => rfp.lanes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'rfp_id', foreignKeyConstraintName: 'fk_rfp_lanes_rfp' })
  rfp!: Rfp;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
