import { MigrationInterface, QueryRunner } from "typeorm";

export class AddProductConfigurationChecks1710000010000 implements MigrationInterface {
	name = "AddProductConfigurationChecks1710000010000";

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
			ALTER TABLE "product_sizes"
				ADD CONSTRAINT "CHK_PRODUCT_SIZE_PRICE" CHECK ("price" >= 0),
				ADD CONSTRAINT "CHK_PRODUCT_SIZE_DEFAULT_AVAILABLE" CHECK (NOT "is_default" OR "available")
		`);
		await queryRunner.query(`
			ALTER TABLE "product_edges"
				ADD CONSTRAINT "CHK_PRODUCT_EDGE_OVERRIDE" CHECK ("price_override" IS NULL OR "price_override" >= 0)
		`);
		await queryRunner.query(`
			ALTER TABLE "product_additionals"
				ADD CONSTRAINT "CHK_PRODUCT_ADDITIONAL_OVERRIDE" CHECK ("price_override" IS NULL OR "price_override" >= 0)
		`);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "product_additionals" DROP CONSTRAINT "CHK_PRODUCT_ADDITIONAL_OVERRIDE"`);
		await queryRunner.query(`ALTER TABLE "product_edges" DROP CONSTRAINT "CHK_PRODUCT_EDGE_OVERRIDE"`);
		await queryRunner.query(`
			ALTER TABLE "product_sizes"
				DROP CONSTRAINT "CHK_PRODUCT_SIZE_DEFAULT_AVAILABLE",
				DROP CONSTRAINT "CHK_PRODUCT_SIZE_PRICE"
		`);
	}
}
