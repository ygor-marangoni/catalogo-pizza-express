import type { RegisterUserReqDTO, UpdateUserReqDTO } from "../dtos/req";
import type { UserRepository, UserResDTO } from "../dtos/res";
import { ErrorCode } from "../entities/enums";

export class InMemoryUserRepository implements UserRepository {
	private readonly users = new Map<number, UserResDTO>();
	private nextId = 1;

	async findByEmail(email: string): Promise<UserResDTO | null> {
		return (
			[...this.users.values()].find(
				(user) => user.email.toLowerCase() === email.toLowerCase() && !user.deleted_at,
			) || null
		);
	}

	async findById(id: number): Promise<UserResDTO | null> {
		const user = this.users.get(id);
		return user && !user.deleted_at ? user : null;
	}

	async create(data: RegisterUserReqDTO, passwordHash: string): Promise<UserResDTO> {
		const now = new Date();
		const user: UserResDTO = {
			id: this.nextId++,
			name: data.name,
			email: data.email.toLowerCase(),
			password_hash: passwordHash,
			created_at: now,
			updated_at: now,
			deleted_at: null,
		};
		this.users.set(user.id, user);
		return user;
	}

	async update(id: number, data: UpdateUserReqDTO, passwordHash?: string): Promise<UserResDTO> {
		const user = await this.findById(id);
		if (!user) throw new Error(ErrorCode.USER_NOT_FOUND);
		Object.assign(user, data, passwordHash ? { password_hash: passwordHash } : {}, { updated_at: new Date() });
		if (data.email) user.email = data.email.toLowerCase();
		return user;
	}
}
