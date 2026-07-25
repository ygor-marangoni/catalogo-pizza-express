import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateAccounts1710000000000 implements MigrationInterface {
	name = "CreateAccounts1710000000000";

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: "admins",
				columns: [
					{ name: "id", type: "serial", isPrimary: true },
					{ name: "name", type: "varchar", length: "120" },
					{ name: "email", type: "varchar", isUnique: true },
					{ name: "password_hash", type: "text" },
					{ name: "last_login", type: "timestamptz", isNullable: true },
					{ name: "created_at", type: "timestamptz", default: "CURRENT_TIMESTAMP" },
					{ name: "updated_at", type: "timestamptz", default: "CURRENT_TIMESTAMP" },
					{ name: "deleted_at", type: "timestamptz", isNullable: true },
				],
			}),
		);
		await queryRunner.createTable(
			new Table({
				name: "users",
				columns: [
					{ name: "id", type: "serial", isPrimary: true },
					{ name: "name", type: "varchar", length: "120" },
					{ name: "email", type: "varchar", isUnique: true },
					{ name: "password_hash", type: "text" },
					{ name: "last_login", type: "timestamptz", isNullable: true },
					{ name: "created_at", type: "timestamptz", default: "CURRENT_TIMESTAMP" },
					{ name: "updated_at", type: "timestamptz", default: "CURRENT_TIMESTAMP" },
					{ name: "deleted_at", type: "timestamptz", isNullable: true },
				],
			}),
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropTable("users");
		await queryRunner.dropTable("admins");
	}
}
