import type { NullableDate } from "./NullableDate";

export interface ProductResDTO {
	id: number;
	name: string;
	description: string | null;
	category_id: number;
	base_price: number;
	image_url: string | null;
	available: boolean;
	highlighted: boolean;
	created_at: NullableDate;
	updated_at: NullableDate;
	deleted_at: NullableDate;
}
