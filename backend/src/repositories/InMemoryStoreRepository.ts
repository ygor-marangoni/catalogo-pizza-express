import type { UpdateStoreReqDTO } from "../dtos/req";
import type { StoreRepository, StoreResDTO } from "../dtos/res";

export class InMemoryStoreRepository implements StoreRepository {
	private store: StoreResDTO = {
		id: 1,
		name: "Pizza Express",
		description: "Pizzaria Express",
		phone: null,
		email: null,
		address: null,
		opening_hours: "18:00 às 23:00",
		is_open: true,
		delivery_fee: 500,
		min_order_value: 2500,
		created_at: new Date(),
		updated_at: new Date(),
	};

	async find(): Promise<StoreResDTO> {
		return this.store;
	}

	async update(data: UpdateStoreReqDTO): Promise<StoreResDTO> {
		this.store = { ...this.store, ...data, updated_at: new Date() };
		return this.store;
	}

	async updateStatus(isOpen: boolean): Promise<StoreResDTO> {
		this.store = { ...this.store, is_open: isOpen, updated_at: new Date() };
		return this.store;
	}
}
