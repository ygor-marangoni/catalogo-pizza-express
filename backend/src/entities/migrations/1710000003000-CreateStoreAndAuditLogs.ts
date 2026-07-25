import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateStoreAndAuditLogs1710000003000 implements MigrationInterface {
	name = "CreateStoreAndAuditLogs1710000003000";

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: "stores",
				columns: [
					{ name: "id", type: "integer", isPrimary: true, default: 1 },
					{ name: "name", type: "varchar", length: "160" },
					{ name: "description", type: "text", isNullable: true },
					{ name: "phone", type: "varchar", length: "40", isNullable: true },
					{ name: "email", type: "varchar", isNullable: true },
					{ name: "address", type: "text", isNullable: true },
					{ name: "opening_hours", type: "text", isNullable: true },
					{ name: "is_open", type: "boolean", default: true },
					{ name: "delivery_fee", type: "integer", default: 0 },
					{ name: "min_order_value", type: "integer", default: 0 },
					{ name: "created_at", type: "timestamptz", default: "CURRENT_TIMESTAMP" },
					{ name: "updated_at", type: "timestamptz", default: "CURRENT_TIMESTAMP" },
				],
			}),
		);
		await queryRunner.createTable(
			new Table({
				name: "admin_audit_logs",
				columns: [
					{ name: "id", type: "bigserial", isPrimary: true },
					{ name: "admin_id", type: "integer", isNullable: true },
					{ name: "action", type: "varchar", length: "120" },
					{ name: "resource", type: "varchar", length: "120" },
					{ name: "resource_id", type: "integer", isNullable: true },
					{ name: "metadata", type: "jsonb", isNullable: true },
					{ name: "created_at", type: "timestamptz", default: "CURRENT_TIMESTAMP" },
				],
			}),
		);
		await queryRunner.createForeignKey(
			"admin_audit_logs",
			new TableForeignKey({
				columnNames: ["admin_id"],
				referencedTableName: "admins",
				referencedColumnNames: ["id"],
				onDelete: "SET NULL",
			}),
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropTable("admin_audit_logs");
		await queryRunner.dropTable("stores");
	}
}
