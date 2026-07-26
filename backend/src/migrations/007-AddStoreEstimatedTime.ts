import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddStoreEstimatedTime1710000006000 implements MigrationInterface {
	name = "AddStoreEstimatedTime1710000006000";

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.addColumn("stores", new TableColumn({
			name: "estimated_time",
			type: "varchar",
			length: "40",
			isNullable: true,
			default: "'60–70 min'",
		}));
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropColumn("stores", "estimated_time");
	}
}
