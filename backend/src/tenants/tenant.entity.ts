import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Rfp } from '../rfps/rfp.entity';
import { TenantMembership } from './tenant-membership.entity';

@Entity('tenants')
export class Tenant {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ unique: true })
  slug!: string;

  @OneToMany(() => TenantMembership, (membership) => membership.tenant)
  memberships!: TenantMembership[];

  @OneToMany(() => Rfp, (rfp) => rfp.tenant)
  rfps!: Rfp[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
