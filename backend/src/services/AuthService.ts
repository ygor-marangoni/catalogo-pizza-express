const bcrypt = require("bcrypt");
import { ErrorCode } from "../entities/enums";
import type { AdminRepository, AdminResDTO, UserRepository, UserResDTO } from "../dtos/res";
import type { RegisterUserReqDTO, UpdateUserReqDTO } from "../dtos/req";

class AuthService {
	// Centraliza autenticação, cadastro e atualização de contas.
	private readonly adminRepository: AdminRepository;
	private readonly userRepository: UserRepository;

	constructor(adminRepository: AdminRepository, userRepository: UserRepository) {
		this.adminRepository = adminRepository;
		this.userRepository = userRepository;
	}

	async login(email: string, password: string): Promise<AdminResDTO> {
		try {
			const admin = await this.adminRepository.findByEmail(email);

			if (!admin) {
				throw new Error(ErrorCode.INVALID_CREDENTIALS);
			}

			const passwordMatch = await bcrypt.compare(password, admin.password_hash);

			if (!passwordMatch) {
				throw new Error(ErrorCode.INVALID_CREDENTIALS);
			}

			return admin;
		} catch (error) {
			throw error;
		}
	}

	async hashPassword(password: string): Promise<string> {
		try {
			const salt = await bcrypt.genSalt(10);
			return await bcrypt.hash(password, salt);
		} catch (error) {
			throw new Error(`Erro ao gerar hash da senha: ${error.message}`);
		}
	}

	async verifyPassword(password: string, hash: string): Promise<boolean> {
		try {
			return await bcrypt.compare(password, hash);
		} catch (error) {
			throw new Error(`Erro ao verificar senha: ${error.message}`);
		}
	}

	async getAdminById(id: number): Promise<AdminResDTO> {
		try {
			const admin = await this.adminRepository.findById(id);
			if (!admin) {
				throw new Error(ErrorCode.ADMIN_NOT_FOUND);
			}
			return admin;
		} catch (error) {
			throw error;
		}
	}

	async registerUser(data: RegisterUserReqDTO): Promise<UserResDTO> {
		if (await this.userRepository.findByEmail(data.email)) throw new Error(ErrorCode.EMAIL_ALREADY_EXISTS);
		return this.userRepository.create(data, await this.hashPassword(data.password));
	}

	async loginUser(email: string, password: string): Promise<UserResDTO> {
		const user = await this.userRepository.findByEmail(email);
		if (!user || !(await this.verifyPassword(password, user.password_hash)))
			throw new Error(ErrorCode.INVALID_CREDENTIALS);
		return user;
	}

	async authenticate(
		email: string,
		password: string,
	): Promise<{
		account: AdminResDTO | UserResDTO;
		role: "ADMIN" | "CUSTOMER";
	}> {
		const admin = await this.adminRepository.findByEmail(email);
		if (admin && (await this.verifyPassword(password, admin.password_hash))) {
			return { account: admin, role: "ADMIN" };
		}
		const customer = await this.userRepository.findByEmail(email);
		if (customer && (await this.verifyPassword(password, customer.password_hash))) {
			return { account: customer, role: "CUSTOMER" };
		}
		throw new Error(ErrorCode.INVALID_CREDENTIALS);
	}

	async getUserById(id: number): Promise<UserResDTO> {
		const user = await this.userRepository.findById(id);
		if (!user) throw new Error(ErrorCode.USER_NOT_FOUND);
		return user;
	}

	async updateUser(id: number, data: UpdateUserReqDTO): Promise<UserResDTO> {
		if (data.email) {
			const existing = await this.userRepository.findByEmail(data.email);
			if (existing && existing.id !== id) throw new Error(ErrorCode.EMAIL_ALREADY_EXISTS);
		}
		const passwordHash = data.password ? await this.hashPassword(data.password) : undefined;
		return this.userRepository.update(id, data, passwordHash);
	}

	async listUsers(search = ""): Promise<UserResDTO[]> {
		return this.userRepository.findAll(search);
	}

	async deleteUser(id: number): Promise<void> {
		await this.userRepository.delete(id);
	}
}

module.exports = AuthService;
