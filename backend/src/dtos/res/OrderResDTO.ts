import type { NullableDate } from "./NullableDate";

export interface OrderResDTO {
	id: number;
	user_id: number;
	items: unknown[];
	total: number;
	status: string;
	created_at: NullableDate;
	updated_at: NullableDate;
	deleted_at: NullableDate;
}
