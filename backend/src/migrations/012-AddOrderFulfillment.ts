import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddOrderFulfillment1710000011000 implements MigrationInterface {
	name = "AddOrderFulfillment1710000011000";

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.addColumns("orders", [
			new TableColumn({ name: "fulfillment", type: "varchar", length: "20", isNullable: true }),
			new TableColumn({ name: "phone", type: "varchar", length: "40", isNullable: true }),
			new TableColumn({ name: "address", type: "text", isNullable: true }),
			new TableColumn({ name: "payment", type: "varchar", length: "30", isNullable: true }),
			new TableColumn({ name: "notes", type: "text", isNullable: true }),
			new TableColumn({ name: "delivery_fee", type: "integer", default: 0 }),
			new TableColumn({ name: "discount", type: "integer", default: 0 }),
			new TableColumn({ name: "coupon_code", type: "varchar", length: "40", isNullable: true }),
		]);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		for (const column of ["coupon_code", "discount", "delivery_fee", "notes", "payment", "address", "phone", "fulfillment"]) {
			await queryRunner.dropColumn("orders", column);
		}
	}
}
