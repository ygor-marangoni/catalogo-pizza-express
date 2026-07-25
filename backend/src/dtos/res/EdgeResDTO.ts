import type { NullableDate } from "./NullableDate";

export interface EdgeResDTO {
	id: number;
	name: string;
	description: string | null;
	additional_price: number;
	created_at: NullableDate;
	updated_at: NullableDate;
	deleted_at: NullableDate;
}
