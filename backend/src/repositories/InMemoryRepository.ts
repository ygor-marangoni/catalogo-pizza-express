import type { Repository } from "../dtos/res";

type Resource = {
	id: number;
	deleted_at?: Date | null;
	created_at?: Date | null;
	updated_at?: Date | null;
};

export class InMemoryRepository<T extends Resource> implements Repository<T, Partial<T>, Partial<T>> {
	private readonly records = new Map<number, T>();
	private nextId = 1;

	constructor(initial: T[] = []) {
		initial.forEach((record) => {
			this.records.set(record.id, record);
			this.nextId = Math.max(this.nextId, record.id + 1);
		});
	}

	async findAll(filters: Record<string, unknown> = {}): Promise<T[]> {
		return [...this.records.values()].filter(
			(record) =>
				!record.deleted_at &&
				Object.entries(filters).every(
					([key, value]) =>
						value === undefined || value === "" || String(record[key as keyof T]) === String(value),
				),
		);
	}

	async findById(id: number): Promise<T | null> {
		const record = this.records.get(id);
		return record && !record.deleted_at ? record : null;
	}

	async create(data: Partial<T>): Promise<T> {
		this.ensureUnique(data);
		const now = new Date();
		const record = {
			...data,
			id: this.nextId++,
			created_at: now,
			updated_at: now,
			deleted_at: null,
		} as T;
		this.records.set(record.id, record);
		return record;
	}

	async update(id: number, data: Partial<T>): Promise<T> {
		const current = await this.findById(id);
		if (!current) throw Object.assign(new Error("Registro não encontrado"), { code: "RESOURCE_NOT_FOUND", statusCode: 404 });
		this.ensureUnique(data, id);
		const record = { ...current, ...data, id, updated_at: new Date() } as T;
		this.records.set(id, record);
		return record;
	}

	async delete(id: number): Promise<void> {
		const current = await this.findById(id);
		if (!current) throw Object.assign(new Error("Registro não encontrado"), { code: "RESOURCE_NOT_FOUND", statusCode: 404 });
		this.records.set(id, {
			...current,
			deleted_at: new Date(),
			updated_at: new Date(),
		});
	}

	private ensureUnique(data: Partial<T>, ignoredId?: number): void {
		for (const field of ["name", "code"]) {
			const value = data[field];
			if (typeof value !== "string" || !value.trim()) continue;
			const duplicate = [...this.records.values()].find(
				(record) => record.id !== ignoredId && !record.deleted_at && String(record[field]).trim().toLowerCase() === value.trim().toLowerCase(),
			);
			if (duplicate) throw Object.assign(new Error("Registro duplicado"), { code: "DUPLICATE_RESOURCE", statusCode: 409 });
		}
	}
}
