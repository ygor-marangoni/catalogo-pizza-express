import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableUnique } from "typeorm";

export class CreateOrdersAndFavorites1710000002000 implements MigrationInterface {
	name = "CreateOrdersAndFavorites1710000002000";

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: "orders",
				columns: [
					{ name: "id", type: "serial", isPrimary: true },
					{ name: "user_id", type: "integer" },
					{ name: "items", type: "jsonb" },
					{ name: "total", type: "integer" },
					{ name: "status", type: "varchar", length: "30", default: "'PENDING'" },
					{ name: "created_at", type: "timestamptz", default: "CURRENT_TIMESTAMP" },
					{ name: "updated_at", type: "timestamptz", default: "CURRENT_TIMESTAMP" },
					{ name: "deleted_at", type: "timestamptz", isNullable: true },
				],
			}),
		);
		await queryRunner.createForeignKey(
			"orders",
			new TableForeignKey({
				columnNames: ["user_id"],
				referencedTableName: "users",
				referencedColumnNames: ["id"],
				onDelete: "RESTRICT",
			}),
		);
		await queryRunner.createTable(
			new Table({
				name: "favorites",
				columns: [
					{ name: "id", type: "serial", isPrimary: true },
					{ name: "user_id", type: "integer" },
					{ name: "product_id", type: "integer" },
					{ name: "created_at", type: "timestamptz", default: "CURRENT_TIMESTAMP" },
					{ name: "updated_at", type: "timestamptz", default: "CURRENT_TIMESTAMP" },
					{ name: "deleted_at", type: "timestamptz", isNullable: true },
				],
			}),
		);
		await queryRunner.createForeignKey(
			"favorites",
			new TableForeignKey({
				columnNames: ["user_id"],
				referencedTableName: "users",
				referencedColumnNames: ["id"],
				onDelete: "CASCADE",
			}),
		);
		await queryRunner.createForeignKey(
			"favorites",
			new TableForeignKey({
				columnNames: ["product_id"],
				referencedTableName: "products",
				referencedColumnNames: ["id"],
				onDelete: "CASCADE",
			}),
		);
		await queryRunner.createUniqueConstraint(
			"favorites",
			new TableUnique({ name: "UQ_favorites_user_product", columnNames: ["user_id", "product_id"] }),
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropTable("favorites");
		await queryRunner.dropTable("orders");
	}
}
