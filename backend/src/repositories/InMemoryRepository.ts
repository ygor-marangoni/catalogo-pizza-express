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
		if (!current) throw new Error("RESOURCE_NOT_FOUND");
		const record = { ...current, ...data, id, updated_at: new Date() } as T;
		this.records.set(id, record);
		return record;
	}

	async delete(id: number): Promise<void> {
		const current = await this.findById(id);
		if (!current) throw new Error("RESOURCE_NOT_FOUND");
		this.records.set(id, {
			...current,
			deleted_at: new Date(),
			updated_at: new Date(),
		});
	}
}
