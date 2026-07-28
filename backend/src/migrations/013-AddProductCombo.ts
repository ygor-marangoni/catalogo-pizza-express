import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddProductCombo1710000013000 implements MigrationInterface {
	name = "AddProductCombo1710000013000";
	async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.addColumn("products", new TableColumn({ name: "is_combo", type: "boolean", default: false }));
	}

	async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropColumn("products", "is_combo");
	}
}
