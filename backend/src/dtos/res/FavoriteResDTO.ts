import type { NullableDate } from "./NullableDate";

export interface FavoriteResDTO {
	id: number;
	user_id: number;
	product_id: number;
	created_at: NullableDate;
	updated_at: NullableDate;
	deleted_at: NullableDate;
}
