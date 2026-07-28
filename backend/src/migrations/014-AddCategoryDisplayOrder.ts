import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddCategoryDisplayOrder1710000014000 implements MigrationInterface {
	name = "AddCategoryDisplayOrder1710000014000";

	async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.addColumn("categories", new TableColumn({ name: "display_order", type: "integer", default: 0 }));
		await queryRunner.query("UPDATE categories SET display_order = ordered.position FROM (SELECT id, ROW_NUMBER() OVER (ORDER BY id ASC) - 1 AS position FROM categories) AS ordered WHERE categories.id = ordered.id");
	}

	async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropColumn("categories", "display_order");
	}
}
