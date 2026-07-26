import type { NullableDate } from "./NullableDate";

export interface StoreResDTO {
	id: number;
	name: string;
	description: string | null;
	phone: string | null;
	email: string | null;
	address: string | null;
	opening_hours: string | null;
	estimated_time: string | null;
	is_open: boolean;
	delivery_fee: number;
	min_order_value: number;
	created_at: NullableDate;
	updated_at: NullableDate;
}
