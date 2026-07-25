import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateCatalog1710000001000 implements MigrationInterface {
	name = "CreateCatalog1710000001000";

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: "categories",
				columns: [
					{ name: "id", type: "serial", isPrimary: true },
					{ name: "name", type: "varchar", length: "120" },
					{ name: "description", type: "text", isNullable: true },
					{ name: "icon_url", type: "text", isNullable: true },
					{ name: "created_at", type: "timestamptz", default: "CURRENT_TIMESTAMP" },
					{ name: "updated_at", type: "timestamptz", default: "CURRENT_TIMESTAMP" },
					{ name: "deleted_at", type: "timestamptz", isNullable: true },
				],
			}),
		);
		await queryRunner.createTable(
			new Table({
				name: "products",
				columns: [
					{ name: "id", type: "serial", isPrimary: true },
					{ name: "name", type: "varchar", length: "160" },
					{ name: "description", type: "text", isNullable: true },
					{ name: "category_id", type: "integer" },
					{ name: "base_price", type: "integer" },
					{ name: "image_url", type: "text", isNullable: true },
					{ name: "available", type: "boolean", default: true },
					{ name: "highlighted", type: "boolean", default: false },
					{ name: "created_at", type: "timestamptz", default: "CURRENT_TIMESTAMP" },
					{ name: "updated_at", type: "timestamptz", default: "CURRENT_TIMESTAMP" },
					{ name: "deleted_at", type: "timestamptz", isNullable: true },
				],
			}),
		);
		await queryRunner.createForeignKey(
			"products",
			new TableForeignKey({
				columnNames: ["category_id"],
				referencedTableName: "categories",
				referencedColumnNames: ["id"],
				onDelete: "RESTRICT",
			}),
		);
		await queryRunner.createTable(
			new Table({
				name: "sizes",
				columns: [
					{ name: "id", type: "serial", isPrimary: true },
					{ name: "name", type: "varchar", length: "80" },
					{ name: "code", type: "varchar", length: "40", isUnique: true },
					{ name: "description", type: "text", isNullable: true },
					{ name: "additional_price", type: "integer", default: 0 },
					{ name: "created_at", type: "timestamptz", default: "CURRENT_TIMESTAMP" },
					{ name: "updated_at", type: "timestamptz", default: "CURRENT_TIMESTAMP" },
					{ name: "deleted_at", type: "timestamptz", isNullable: true },
				],
			}),
		);
		await queryRunner.createTable(
			new Table({
				name: "edges",
				columns: [
					{ name: "id", type: "serial", isPrimary: true },
					{ name: "name", type: "varchar", length: "120" },
					{ name: "description", type: "text", isNullable: true },
					{ name: "additional_price", type: "integer", default: 0 },
					{ name: "created_at", type: "timestamptz", default: "CURRENT_TIMESTAMP" },
					{ name: "updated_at", type: "timestamptz", default: "CURRENT_TIMESTAMP" },
					{ name: "deleted_at", type: "timestamptz", isNullable: true },
				],
			}),
		);
		await queryRunner.createTable(
			new Table({
				name: "additionals",
				columns: [
					{ name: "id", type: "serial", isPrimary: true },
					{ name: "name", type: "varchar", length: "120" },
					{ name: "description", type: "text", isNullable: true },
					{ name: "price", type: "integer", default: 0 },
					{ name: "created_at", type: "timestamptz", default: "CURRENT_TIMESTAMP" },
					{ name: "updated_at", type: "timestamptz", default: "CURRENT_TIMESTAMP" },
					{ name: "deleted_at", type: "timestamptz", isNullable: true },
				],
			}),
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropTable("additionals");
		await queryRunner.dropTable("edges");
		await queryRunner.dropTable("sizes");
		await queryRunner.dropTable("products");
		await queryRunner.dropTable("categories");
	}
}
