const bcrypt = require("bcrypt");
import type { AdminRepository, AdminResource } from "../types/domain";

class AuthService {
	private readonly adminRepository: AdminRepository;

	constructor(adminRepository: AdminRepository) {
		this.adminRepository = adminRepository;
	}

	async login(email: string, password: string): Promise<AdminResource> {
		try {
			const admin = await this.adminRepository.findByEmail(email);

			if (!admin) {
				throw new Error("INVALID_CREDENTIALS");
			}

			const passwordMatch = await bcrypt.compare(
				password,
				admin.password_hash,
			);

			if (!passwordMatch) {
				throw new Error("INVALID_CREDENTIALS");
			}

			// Atualizar último login
			await this.adminRepository.updateLastLogin(admin.id);

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

	async getAdminById(id: number): Promise<AdminResource> {
		try {
			const admin = await this.adminRepository.findById(id);
			if (!admin) {
				throw new Error("ADMIN_NOT_FOUND");
			}
			return admin;
		} catch (error) {
			throw error;
		}
	}
}

module.exports = AuthService;
