import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { TenantRole } from './tenant-role.enum';
import { Tenant } from './tenant.entity';

@Entity('tenant_memberships')
@Unique('uq_tenant_memberships_tenant_user', ['tenantId', 'userId'])
export class TenantMembership {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'tenant_id' })
  @Index('idx_tenant_memberships_tenant_id')
  tenantId!: string;

  @Column({ name: 'user_id' })
  @Index('idx_tenant_memberships_user_id')
  userId!: string;

  @Column({ type: 'enum', enum: TenantRole })
  role!: TenantRole;

  @ManyToOne(() => Tenant, (tenant) => tenant.memberships, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'tenant_id',
    foreignKeyConstraintName: 'fk_tenant_memberships_tenant',
  })
  tenant!: Tenant;

  @ManyToOne(() => User, (user) => user.memberships, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'user_id',
    foreignKeyConstraintName: 'fk_tenant_memberships_user',
  })
  user!: User;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
