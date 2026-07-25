import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCatalogUniqueConstraints1710000004000 implements MigrationInterface {
	name = "AddCatalogUniqueConstraints1710000004000";

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query('CREATE UNIQUE INDEX IF NOT EXISTS "UQ_categories_name_active" ON "categories" (LOWER("name")) WHERE "deleted_at" IS NULL');
		await queryRunner.query('CREATE UNIQUE INDEX IF NOT EXISTS "UQ_products_name_active" ON "products" (LOWER("name")) WHERE "deleted_at" IS NULL');
		await queryRunner.query('CREATE UNIQUE INDEX IF NOT EXISTS "UQ_additionals_name_active" ON "additionals" (LOWER("name")) WHERE "deleted_at" IS NULL');
		await queryRunner.query('CREATE UNIQUE INDEX IF NOT EXISTS "UQ_edges_name_active" ON "edges" (LOWER("name")) WHERE "deleted_at" IS NULL');
		await queryRunner.query('CREATE UNIQUE INDEX IF NOT EXISTS "UQ_sizes_name_active" ON "sizes" (LOWER("name")) WHERE "deleted_at" IS NULL');
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query('DROP INDEX IF EXISTS "UQ_sizes_name_active"');
		await queryRunner.query('DROP INDEX IF EXISTS "UQ_edges_name_active"');
		await queryRunner.query('DROP INDEX IF EXISTS "UQ_additionals_name_active"');
		await queryRunner.query('DROP INDEX IF EXISTS "UQ_products_name_active"');
		await queryRunner.query('DROP INDEX IF EXISTS "UQ_categories_name_active"');
	}
}
