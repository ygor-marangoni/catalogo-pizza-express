import { Repository } from "typeorm";
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
			deleted_at: null,
			...Object.fromEntries(
				Object.entries(filters).filter(
					([key, value]) =>
						value !== undefined &&
						value !== "" &&
						["category_id", "available", "highlighted", "user_id", "product_id", "status"].includes(key),
				),
			),
		} as any;
		return this.repository.find({ where, order: { id: "DESC" } } as any);
	}

	async findById(id: number): Promise<T | null> {
		return this.repository.findOne({
			where: { id, deleted_at: null } as any,
		});
	}

	async create(data: Partial<T>): Promise<T> {
		const record = this.repository.create(data as T);
		return this.repository.save(record);
	}

	async update(id: number, data: Partial<T>): Promise<T> {
		const record = await this.findById(id);
		if (!record) throw new Error("RESOURCE_NOT_FOUND");
		Object.assign(record, data, { updated_at: new Date() });
		return this.repository.save(record);
	}

	async delete(id: number): Promise<void> {
		const record = await this.findById(id);
		if (!record) throw new Error("RESOURCE_NOT_FOUND");
		Object.assign(record, {
			deleted_at: new Date(),
			updated_at: new Date(),
		});
		await this.repository.save(record);
	}
}
