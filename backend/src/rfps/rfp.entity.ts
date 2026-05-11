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
@Index(['tenantId', 'status'])
export class Rfp {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'tenant_id' })
  @Index()
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
  @JoinColumn({ name: 'tenant_id' })
  tenant!: Tenant;

  @OneToMany(() => RfpLane, (lane) => lane.rfp)
  lanes!: RfpLane[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
