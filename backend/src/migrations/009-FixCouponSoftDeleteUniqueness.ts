import { MigrationInterface, QueryRunner } from "typeorm";

export class FixCouponSoftDeleteUniqueness1710000008000 implements MigrationInterface {
	name = "FixCouponSoftDeleteUniqueness1710000008000";

	public async up(queryRunner: QueryRunner): Promise<void> {
		const table = await queryRunner.getTable("coupons");
		const codeUnique = table?.uniques.find(
			(unique) => unique.columnNames.length === 1 && unique.columnNames[0] === "code",
		);

		if (codeUnique) await queryRunner.dropUniqueConstraint("coupons", codeUnique);

		await queryRunner.query(`
			CREATE UNIQUE INDEX IF NOT EXISTS "UQ_COUPONS_ACTIVE_CODE"
			ON "coupons" (UPPER("code"))
			WHERE "deleted_at" IS NULL
		`);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query('DROP INDEX IF EXISTS "UQ_COUPONS_ACTIVE_CODE"');
	}
}
