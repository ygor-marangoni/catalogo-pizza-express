import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveLastLogin1710000006000 implements MigrationInterface {
	name = "RemoveLastLogin1710000006000";

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropColumn("admins", "last_login");
		await queryRunner.dropColumn("users", "last_login");
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query('ALTER TABLE "admins" ADD "last_login" TIMESTAMP WITH TIME ZONE');
		await queryRunner.query('ALTER TABLE "users" ADD "last_login" TIMESTAMP WITH TIME ZONE');
	}
}
