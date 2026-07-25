import type { AdminResDTO } from "./AdminResDTO";
import type { StoreResDTO } from "./StoreResDTO";
import type { UpdateStoreReqDTO } from "../req/UpdateStoreReqDTO";
import type { RegisterUserReqDTO, UpdateUserReqDTO } from "../req";
import type { UserResDTO } from "./UserResDTO";

export interface Repository<T, CreateInput = Partial<T>, UpdateInput = Partial<T>> {
	findAll(filters?: Record<string, unknown>): Promise<T[]>;
	findById(id: number): Promise<T | null>;
	create(data: CreateInput): Promise<T>;
	update(id: number, data: UpdateInput): Promise<T>;
	delete(id: number): Promise<void>;
}

export interface StoreRepository {
	find(): Promise<StoreResDTO | null>;
	update(data: UpdateStoreReqDTO): Promise<StoreResDTO>;
	updateStatus(isOpen: boolean): Promise<StoreResDTO>;
}

export interface AdminRepository {
	findByEmail(email: string): Promise<AdminResDTO | null>;
	findById(id: number): Promise<AdminResDTO | null>;
}

export interface UserRepository {
	findByEmail(email: string): Promise<UserResDTO | null>;
	findById(id: number): Promise<UserResDTO | null>;
	create(data: RegisterUserReqDTO, passwordHash: string): Promise<UserResDTO>;
	update(id: number, data: UpdateUserReqDTO, passwordHash?: string): Promise<UserResDTO>;
}
