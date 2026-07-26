import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableUnique } from "typeorm";

export class CreateProductOptionRelations1710000007000 implements MigrationInterface {
	name = "CreateProductOptionRelations1710000007000";

	public async up(queryRunner: QueryRunner): Promise<void> {
		const relations = [
			{ name: "product_sizes", option: "size_id", table: "sizes" },
			{ name: "product_edges", option: "edge_id", table: "edges" },
			{ name: "product_additionals", option: "additional_id", table: "additionals" },
		];
		for (const relation of relations) {
			await queryRunner.createTable(new Table({
				name: relation.name,
				columns: [
					{ name: "id", type: "serial", isPrimary: true },
					{ name: "product_id", type: "integer" },
					{ name: relation.option, type: "integer" },
				],
				uniques: [new TableUnique({ columnNames: ["product_id", relation.option] })],
			}));
			await queryRunner.createForeignKey(relation.name, new TableForeignKey({ columnNames: ["product_id"], referencedTableName: "products", referencedColumnNames: ["id"], onDelete: "CASCADE" }));
			await queryRunner.createForeignKey(relation.name, new TableForeignKey({ columnNames: [relation.option], referencedTableName: relation.table, referencedColumnNames: ["id"], onDelete: "RESTRICT" }));
		}
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropTable("product_additionals");
		await queryRunner.dropTable("product_edges");
		await queryRunner.dropTable("product_sizes");
	}
}
