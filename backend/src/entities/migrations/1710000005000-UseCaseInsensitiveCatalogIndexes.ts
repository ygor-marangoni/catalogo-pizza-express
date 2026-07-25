import { MigrationInterface, QueryRunner } from "typeorm";

export class UseCaseInsensitiveCatalogIndexes1710000005000 implements MigrationInterface {
	name = "UseCaseInsensitiveCatalogIndexes1710000005000";

	public async up(queryRunner: QueryRunner): Promise<void> {
		for (const table of ["categories", "products", "additionals", "edges", "sizes"]) {
			const index = `UQ_${table}_name_active`;
			await queryRunner.query(`DROP INDEX IF EXISTS "${index}"`);
			await queryRunner.query(`CREATE UNIQUE INDEX "${index}" ON "${table}" (LOWER("name")) WHERE "deleted_at" IS NULL`);
		}
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		for (const table of ["categories", "products", "additionals", "edges", "sizes"]) {
			const index = `UQ_${table}_name_active`;
			await queryRunner.query(`DROP INDEX IF EXISTS "${index}"`);
			await queryRunner.query(`CREATE UNIQUE INDEX "${index}" ON "${table}" ("name") WHERE "deleted_at" IS NULL`);
		}
	}
}
