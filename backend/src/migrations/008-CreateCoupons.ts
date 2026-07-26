import { MigrationInterface, QueryRunner, Table, TableIndex } from "typeorm";

export class CreateCoupons1710000007000 implements MigrationInterface {
	name = "CreateCoupons1710000007000";

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(new Table({
			name: "coupons",
			columns: [
				{ name: "id", type: "serial", isPrimary: true },
				{ name: "code", type: "varchar", length: "40", isUnique: true },
				{ name: "description", type: "text", isNullable: true },
				{ name: "discount_type", type: "varchar", length: "16" },
				{ name: "discount_value", type: "integer" },
				{ name: "min_order_value", type: "integer", default: 0 },
				{ name: "active", type: "boolean", default: true },
				{ name: "expires_at", type: "timestamptz", isNullable: true },
				{ name: "created_at", type: "timestamptz", default: "CURRENT_TIMESTAMP" },
				{ name: "updated_at", type: "timestamptz", default: "CURRENT_TIMESTAMP" },
				{ name: "deleted_at", type: "timestamptz", isNullable: true },
			],
		}));
		await queryRunner.createIndex("coupons", new TableIndex({
			name: "IDX_COUPONS_CODE_ACTIVE",
			columnNames: ["code", "active"],
		}));
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropTable("coupons");
	}
}
