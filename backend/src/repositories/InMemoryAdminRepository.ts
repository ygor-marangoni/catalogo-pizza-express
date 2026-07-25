import bcrypt from "bcrypt";
import type { AdminRepository, AdminResDTO } from "../dtos/res";

export class InMemoryAdminRepository implements AdminRepository {
	private readonly admin: AdminResDTO = {
		id: 1,
		name: "Administrador",
		email: process.env.ADMIN_EMAIL || "admin@pizzaexpress.com",
		password_hash: bcrypt.hashSync(process.env.ADMIN_PASSWORD || "senha", 10),
		created_at: new Date(),
		updated_at: new Date(),
		deleted_at: null,
	};

	async findByEmail(email: string): Promise<AdminResDTO | null> {
		return email.toLowerCase() === this.admin.email.toLowerCase() ? this.admin : null;
	}

	async findById(id: number): Promise<AdminResDTO | null> {
		return id === this.admin.id ? this.admin : null;
	}
}
