import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RfpLane } from '../rfp-lanes/rfp-lane.entity';
import { Tenant } from '../tenants/tenant.entity';
import { RfpStatus } from './rfp-status.enum';

@Entity('rfps')
@Index('idx_rfps_tenant_id_status', ['tenantId', 'status'])
export class Rfp {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'tenant_id' })
  @Index('idx_rfps_tenant_id')
  tenantId!: string;

  @Column()
  title!: string;

  @Column({ name: 'customer_name' })
  customerName!: string;

  @Column({ type: 'enum', enum: RfpStatus, default: RfpStatus.Draft })
  status!: RfpStatus;

  @Column({ name: 'due_date', type: 'date' })
  dueDate!: string;

  @ManyToOne(() => Tenant, (tenant) => tenant.rfps, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenant_id', foreignKeyConstraintName: 'fk_rfps_tenant' })
  tenant!: Tenant;

  @OneToMany(() => RfpLane, (lane) => lane.rfp)
  lanes!: RfpLane[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
