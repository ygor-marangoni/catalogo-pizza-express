import type { NullableDate } from "./NullableDate";

export interface UserResDTO {
	id: number;
	name: string;
	email: string;
	password_hash: string;
	created_at: NullableDate;
	updated_at: NullableDate;
	deleted_at: NullableDate;
}
