import { IsNull } from "typeorm";
import { AppDataSource } from "../config/ormConfig";
import { Admin } from "../entities";
import type { AdminRepository, AdminResDTO } from "../dtos/res";

export class TypeOrmAdminRepository implements AdminRepository {
	private get repository() {
		return AppDataSource.getRepository(Admin);
	}

	async findByEmail(email: string): Promise<AdminResDTO | null> {
		return this.repository.findOne({
			where: { email, deleted_at: IsNull() },
		}) as Promise<AdminResDTO | null>;
	}

	async findById(id: number): Promise<AdminResDTO | null> {
		return this.repository.findOne({
			where: { id, deleted_at: IsNull() },
		}) as Promise<AdminResDTO | null>;
	}
}
