import { MigrationInterface, QueryRunner, Table } from "typeorm";
export class CreateRefreshSessions1710000012000 implements MigrationInterface {
  name = "CreateRefreshSessions1710000012000";
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({ name: "refresh_sessions", columns: [
      { name: "id", type: "serial", isPrimary: true }, { name: "token_hash", type: "varchar", length: "128", isUnique: true },
      { name: "account_id", type: "integer" }, { name: "role", type: "varchar", length: "20" }, { name: "expires_at", type: "timestamptz" },
      { name: "revoked_at", type: "timestamptz", isNullable: true }, { name: "created_at", type: "timestamptz", default: "CURRENT_TIMESTAMP" },
    ] }));
    await queryRunner.query('CREATE INDEX "IDX_refresh_sessions_account" ON "refresh_sessions" ("account_id", "role")');
  }
  public async down(queryRunner: QueryRunner): Promise<void> { await queryRunner.dropTable("refresh_sessions"); }
}
