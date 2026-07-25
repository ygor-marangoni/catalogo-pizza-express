import type { NullableDate } from "./NullableDate";

export interface SizeResDTO {
	id: number;
	name: string;
	code: string;
	description: string | null;
	additional_price: number;
	created_at: NullableDate;
	updated_at: NullableDate;
	deleted_at: NullableDate;
}
