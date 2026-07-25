import type { NullableDate } from "./NullableDate";

export interface AdditionalResDTO {
	id: number;
	name: string;
	description: string | null;
	price: number;
	created_at: NullableDate;
	updated_at: NullableDate;
	deleted_at: NullableDate;
}
