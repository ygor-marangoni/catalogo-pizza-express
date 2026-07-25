export interface UpdateStoreReqDTO {
	name?: string;
	description?: string | null;
	phone?: string | null;
	email?: string | null;
	address?: string | null;
	opening_hours?: string | null;
	delivery_fee?: number;
	min_order_value?: number;
}
