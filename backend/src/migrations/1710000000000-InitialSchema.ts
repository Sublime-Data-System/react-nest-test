import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1710000000000 implements MigrationInterface {
  name = 'InitialSchema1710000000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');
    await queryRunner.query(
      "CREATE TYPE tenant_memberships_role_enum AS ENUM ('admin', 'user')",
    );
    await queryRunner.query(
      "CREATE TYPE rfps_status_enum AS ENUM ('draft', 'active', 'closed')",
    );
    await queryRunner.query(
      "CREATE TYPE rfp_lanes_status_enum AS ENUM ('open', 'awarded', 'closed')",
    );

    await queryRunner.query(`
      CREATE TABLE tenants (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        name varchar NOT NULL,
        slug varchar NOT NULL UNIQUE,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      )
    `);

    await queryRunner.query(`
      CREATE TABLE users (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        email varchar NOT NULL UNIQUE,
        password_hash varchar NOT NULL,
        full_name varchar NOT NULL,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      )
    `);

    await queryRunner.query(`
      CREATE TABLE tenant_memberships (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        tenant_id uuid NOT NULL,
        user_id uuid NOT NULL,
        role tenant_memberships_role_enum NOT NULL,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT fk_tenant_memberships_tenant
          FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
        CONSTRAINT fk_tenant_memberships_user
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        CONSTRAINT uq_tenant_memberships_tenant_user UNIQUE (tenant_id, user_id)
      )
    `);
    await queryRunner.query(
      'CREATE INDEX idx_tenant_memberships_tenant_id ON tenant_memberships(tenant_id)',
    );
    await queryRunner.query(
      'CREATE INDEX idx_tenant_memberships_user_id ON tenant_memberships(user_id)',
    );

    await queryRunner.query(`
      CREATE TABLE rfps (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        tenant_id uuid NOT NULL,
        title varchar NOT NULL,
        customer_name varchar NOT NULL,
        status rfps_status_enum NOT NULL DEFAULT 'draft',
        due_date date NOT NULL,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT fk_rfps_tenant
          FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
      )
    `);
    await queryRunner.query('CREATE INDEX idx_rfps_tenant_id ON rfps(tenant_id)');
    await queryRunner.query(
      'CREATE INDEX idx_rfps_tenant_id_status ON rfps(tenant_id, status)',
    );

    await queryRunner.query(`
      CREATE TABLE rfp_lanes (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        tenant_id uuid NOT NULL,
        rfp_id uuid NOT NULL,
        origin_city varchar NOT NULL,
        origin_state varchar NOT NULL,
        destination_city varchar NOT NULL,
        destination_state varchar NOT NULL,
        equipment_type varchar NOT NULL,
        estimated_volume integer NOT NULL,
        status rfp_lanes_status_enum NOT NULL DEFAULT 'open',
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT fk_rfp_lanes_tenant
          FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
        CONSTRAINT fk_rfp_lanes_rfp
          FOREIGN KEY (rfp_id) REFERENCES rfps(id) ON DELETE CASCADE
      )
    `);
    await queryRunner.query(
      'CREATE INDEX idx_rfp_lanes_tenant_id ON rfp_lanes(tenant_id)',
    );
    await queryRunner.query('CREATE INDEX idx_rfp_lanes_rfp_id ON rfp_lanes(rfp_id)');
    await queryRunner.query(
      'CREATE INDEX idx_rfp_lanes_tenant_id_rfp_id ON rfp_lanes(tenant_id, rfp_id)',
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS rfp_lanes');
    await queryRunner.query('DROP TABLE IF EXISTS rfps');
    await queryRunner.query('DROP TABLE IF EXISTS tenant_memberships');
    await queryRunner.query('DROP TABLE IF EXISTS users');
    await queryRunner.query('DROP TABLE IF EXISTS tenants');
    await queryRunner.query('DROP TYPE IF EXISTS rfp_lanes_status_enum');
    await queryRunner.query('DROP TYPE IF EXISTS rfps_status_enum');
    await queryRunner.query('DROP TYPE IF EXISTS tenant_memberships_role_enum');
  }
}
