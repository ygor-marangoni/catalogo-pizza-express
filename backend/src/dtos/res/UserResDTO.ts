import type { NullableDate } from "./NullableDate";

export interface UserResDTO {
	id: number;
	name: string;
	email: string;
	password_hash: string;
	last_login: NullableDate;
	created_at: NullableDate;
	updated_at: NullableDate;
	deleted_at: NullableDate;
}
