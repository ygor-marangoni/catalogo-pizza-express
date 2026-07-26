import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from "typeorm";

export class CreateProductConfigurations1710000009000 implements MigrationInterface {
	name = "CreateProductConfigurations1710000009000";

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(new Table({
			name: "product_sizes",
			columns: [
				{ name: "product_id", type: "integer", isPrimary: true },
				{ name: "size_id", type: "integer", isPrimary: true },
				{ name: "price", type: "integer" },
				{ name: "is_default", type: "boolean", default: false },
				{ name: "available", type: "boolean", default: true },
			],
		}));
		await queryRunner.createTable(new Table({
			name: "product_edges",
			columns: [
				{ name: "product_id", type: "integer", isPrimary: true },
				{ name: "edge_id", type: "integer", isPrimary: true },
				{ name: "price_override", type: "integer", isNullable: true },
				{ name: "available", type: "boolean", default: true },
			],
		}));
		await queryRunner.createTable(new Table({
			name: "product_additionals",
			columns: [
				{ name: "product_id", type: "integer", isPrimary: true },
				{ name: "additional_id", type: "integer", isPrimary: true },
				{ name: "price_override", type: "integer", isNullable: true },
				{ name: "available", type: "boolean", default: true },
			],
		}));

		for (const [table, optionTable, optionColumn] of [
			["product_sizes", "sizes", "size_id"],
			["product_edges", "edges", "edge_id"],
			["product_additionals", "additionals", "additional_id"],
		] as const) {
			await queryRunner.createForeignKey(table, new TableForeignKey({
				columnNames: ["product_id"], referencedTableName: "products", referencedColumnNames: ["id"], onDelete: "CASCADE",
			}));
			await queryRunner.createForeignKey(table, new TableForeignKey({
				columnNames: [optionColumn], referencedTableName: optionTable, referencedColumnNames: ["id"], onDelete: "CASCADE",
			}));
			await queryRunner.createIndex(table, new TableIndex({ name: `IDX_${table.toUpperCase()}_PRODUCT`, columnNames: ["product_id"] }));
		}
		await queryRunner.query(`
			CREATE UNIQUE INDEX "UQ_PRODUCT_SIZES_DEFAULT"
			ON "product_sizes" ("product_id")
			WHERE "is_default" = true
		`);

		await queryRunner.query(`
			INSERT INTO product_sizes (product_id, size_id, price, is_default, available)
			SELECT p.id, s.id, p.base_price + s.additional_price,
				s.id = (
					SELECT s2.id FROM sizes s2
					WHERE s2.deleted_at IS NULL
					ORDER BY s2.additional_price ASC, s2.id ASC LIMIT 1
				),
				true
			FROM products p
			JOIN categories c ON c.id = p.category_id AND c.deleted_at IS NULL
			CROSS JOIN sizes s
			WHERE p.deleted_at IS NULL AND s.deleted_at IS NULL
				AND lower(c.name) LIKE '%pizza%'
		`);
		await queryRunner.query(`
			INSERT INTO product_edges (product_id, edge_id, price_override, available)
			SELECT p.id, e.id, NULL, true
			FROM products p
			JOIN categories c ON c.id = p.category_id AND c.deleted_at IS NULL
			CROSS JOIN edges e
			WHERE p.deleted_at IS NULL AND e.deleted_at IS NULL
				AND lower(c.name) LIKE '%pizza%'
		`);
		await queryRunner.query(`
			INSERT INTO product_additionals (product_id, additional_id, price_override, available)
			SELECT p.id, a.id, NULL, true
			FROM products p
			JOIN categories c ON c.id = p.category_id AND c.deleted_at IS NULL
			CROSS JOIN additionals a
			WHERE p.deleted_at IS NULL AND a.deleted_at IS NULL
				AND lower(c.name) LIKE '%pizza%'
		`);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropTable("product_additionals");
		await queryRunner.dropTable("product_edges");
		await queryRunner.dropTable("product_sizes");
	}
}
