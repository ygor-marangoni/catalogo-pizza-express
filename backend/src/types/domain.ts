export type NullableDate = Date | null;

export interface CategoryResource {
	id: number;
	name: string;
	description: string | null;
	icon_url: string | null;
	created_at: NullableDate;
	updated_at: NullableDate;
	deleted_at: NullableDate;
}

export interface ProductResource {
	id: number;
	name: string;
	description: string | null;
	category_id: number;
	base_price: number;
	image_url: string | null;
	available: boolean;
	highlighted: boolean;
	created_at: NullableDate;
	updated_at: NullableDate;
	deleted_at: NullableDate;
}

export interface StoreResource {
	id: number;
	name: string;
	description: string | null;
	phone: string | null;
	email: string | null;
	address: string | null;
	opening_hours: string | null;
	is_open: boolean;
	delivery_fee: number;
	min_order_value: number;
	created_at: NullableDate;
	updated_at: NullableDate;
}

export interface AdditionalResource {
	id: number;
	name: string;
	description: string | null;
	price: number;
	created_at: NullableDate;
	updated_at: NullableDate;
	deleted_at: NullableDate;
}

export interface AdminResource {
	id: number;
	name: string;
	email: string;
	password_hash: string;
	last_login: NullableDate;
	created_at: NullableDate;
	updated_at: NullableDate;
	deleted_at: NullableDate;
}

export interface SizeResource {
	id: number;
	name: string;
	code: string;
	description: string | null;
	additional_price: number;
	created_at: NullableDate;
	updated_at: NullableDate;
	deleted_at: NullableDate;
}

export interface EdgeResource {
	id: number;
	name: string;
	description: string | null;
	additional_price: number;
	created_at: NullableDate;
	updated_at: NullableDate;
	deleted_at: NullableDate;
}

export interface CategoryInput {
	name: string;
	description?: string | null;
	icon_url?: string | null;
}

export interface ProductInput {
	name: string;
	description?: string | null;
	category_id: number;
	base_price: number;
	image_url?: string | null;
	available?: boolean;
	highlighted?: boolean;
}

export interface StoreInput {
	name?: string;
	description?: string | null;
	phone?: string | null;
	email?: string | null;
	address?: string | null;
	opening_hours?: string | null;
	delivery_fee?: number;
	min_order_value?: number;
}

export interface Repository<T, CreateInput = Partial<T>, UpdateInput = Partial<T>> {
	findAll(filters?: Record<string, unknown>): Promise<T[]>;
	findById(id: number): Promise<T | null>;
	create(data: CreateInput): Promise<T>;
	update(id: number, data: UpdateInput): Promise<T>;
	delete(id: number): Promise<void>;
}

export interface StoreRepository {
	find(): Promise<StoreResource | null>;
	update(data: StoreInput): Promise<StoreResource>;
	updateStatus(isOpen: boolean): Promise<StoreResource>;
}

export interface AdminRepository {
	findByEmail(email: string): Promise<AdminResource | null>;
	findById(id: number): Promise<AdminResource | null>;
	updateLastLogin(id: number): Promise<void>;
}
