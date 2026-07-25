import type { NullableDate } from "./NullableDate";

export interface AdminResDTO {
	id: number;
	name: string;
	email: string;
	password_hash: string;
	last_login: NullableDate;
	created_at: NullableDate;
	updated_at: NullableDate;
	deleted_at: NullableDate;
}
