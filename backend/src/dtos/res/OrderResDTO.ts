import type { NullableDate } from "./NullableDate";

export interface OrderResDTO {
	id: number;
	user_id: number;
	items: unknown[];
	total: number;
	status: string;
	fulfillment?: string | null;
	phone?: string | null;
	address?: string | null;
	payment?: string | null;
	notes?: string | null;
	delivery_fee?: number;
	discount?: number;
	coupon_code?: string | null;
	created_at: NullableDate;
	updated_at: NullableDate;
	deleted_at: NullableDate;
}
