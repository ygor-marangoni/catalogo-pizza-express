import { ILike, IsNull, Repository } from "typeorm";
import { AppDataSource } from "../config/ormConfig";

export class TypeOrmRepository<T extends { id: number; deleted_at?: Date | null }> {
	// Implementa operações CRUD genéricas com exclusão lógica.
	private readonly entity: new () => T;

	constructor(entity: new () => T) {
		this.entity = entity;
	}

	private get repository(): Repository<T> {
		return AppDataSource.getRepository(this.entity);
	}

	async findAll(filters: Record<string, unknown> = {}): Promise<T[]> {
		const where = {
			deleted_at: IsNull(),
			...Object.fromEntries(
				Object.entries(filters).filter(
					([key, value]) =>
						value !== undefined &&
						value !== "" &&
						["category_id", "available", "highlighted", "active", "user_id", "product_id", "status", "name", "code"].includes(key),
				),
			),
		} as any;
		return this.repository.find({ where, order: { id: "DESC" } } as any);
	}

	async findById(id: number): Promise<T | null> {
		return this.repository.findOne({
			where: { id, deleted_at: IsNull() } as any,
		});
	}

	async create(data: Partial<T>): Promise<T> {
		await this.ensureUnique(data);
		const record = this.repository.create(data as T);
		try {
			return await this.repository.save(record);
		} catch (error) {
			if (error?.code === "23505") throw Object.assign(new Error("Registro duplicado"), { code: "DUPLICATE_RESOURCE", statusCode: 409 });
			throw error;
		}
	}

	async update(id: number, data: Partial<T>): Promise<T> {
		const record = await this.findById(id);
		if (!record) throw Object.assign(new Error("Registro não encontrado"), { code: "RESOURCE_NOT_FOUND", statusCode: 404 });
		await this.ensureUnique(data, id);
		Object.assign(record, data, { updated_at: new Date() });
		try {
			return await this.repository.save(record);
		} catch (error) {
			if (error?.code === "23505") throw Object.assign(new Error("Registro duplicado"), { code: "DUPLICATE_RESOURCE", statusCode: 409 });
			throw error;
		}
	}

	async delete(id: number): Promise<void> {
		const record = await this.findById(id);
		if (!record) throw Object.assign(new Error("Registro não encontrado"), { code: "RESOURCE_NOT_FOUND", statusCode: 404 });
		Object.assign(record, {
			deleted_at: new Date(),
			updated_at: new Date(),
		});
		await this.repository.save(record);
	}

	private async ensureUnique(data: Partial<T>, ignoredId?: number): Promise<void> {
		for (const field of ["name", "code"]) {
			const value = data[field];
			if (typeof value !== "string" || !value.trim()) continue;
			const existing = await this.repository.findOne({ where: { [field]: ILike(value.trim()), deleted_at: IsNull() } } as any);
			if (existing && existing.id !== ignoredId)
				throw Object.assign(new Error("Registro duplicado"), { code: "DUPLICATE_RESOURCE", statusCode: 409 });
		}
	}
}
