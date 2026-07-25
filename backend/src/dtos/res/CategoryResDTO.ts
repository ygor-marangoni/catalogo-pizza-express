import type { NullableDate } from "./NullableDate";

export interface CategoryResDTO {
	id: number;
	name: string;
	description: string | null;
	icon_url: string | null;
	created_at: NullableDate;
	updated_at: NullableDate;
	deleted_at: NullableDate;
}
