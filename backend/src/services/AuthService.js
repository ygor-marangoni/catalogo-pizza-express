const bcrypt = require("bcrypt");

class AuthService {
	constructor(adminRepository) {
		this.adminRepository = adminRepository;
	}

	async login(email, password) {
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

	async hashPassword(password) {
		try {
			const salt = await bcrypt.genSalt(10);
			return await bcrypt.hash(password, salt);
		} catch (error) {
			throw new Error(`Erro ao gerar hash da senha: ${error.message}`);
		}
	}

	async verifyPassword(password, hash) {
		try {
			return await bcrypt.compare(password, hash);
		} catch (error) {
			throw new Error(`Erro ao verificar senha: ${error.message}`);
		}
	}

	async getAdminById(id) {
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