import { IsNull } from "typeorm";
import { AppDataSource } from "../config/ormConfig";
import { User } from "../entities";
import type { RegisterUserReqDTO, UpdateUserReqDTO } from "../dtos/req";
import type { UserRepository, UserResDTO } from "../dtos/res";
import { ErrorCode } from "../entities/enums";

export class TypeOrmUserRepository implements UserRepository {
	private get repository() {
		return AppDataSource.getRepository(User);
	}

	async findByEmail(email: string): Promise<UserResDTO | null> {
		return this.repository.findOne({
			where: { email: email.toLowerCase(), deleted_at: IsNull() },
		}) as Promise<UserResDTO | null>;
	}

	async findById(id: number): Promise<UserResDTO | null> {
		return this.repository.findOne({
			where: { id, deleted_at: IsNull() },
		}) as Promise<UserResDTO | null>;
	}

	async create(data: RegisterUserReqDTO, passwordHash: string): Promise<UserResDTO> {
		return this.repository.save(
			this.repository.create({
				name: data.name,
				email: data.email.toLowerCase(),
				password_hash: passwordHash,
			} as User),
		);
	}

	async update(id: number, data: UpdateUserReqDTO, passwordHash?: string): Promise<UserResDTO> {
		const user = await this.findById(id);
		if (!user) throw new Error(ErrorCode.USER_NOT_FOUND);
		Object.assign(user, data, passwordHash ? { password_hash: passwordHash } : {}, { updated_at: new Date() });
		if (data.email) user.email = data.email.toLowerCase();
		return this.repository.save(user as User) as Promise<UserResDTO>;
	}
}
