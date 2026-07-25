import type { AdminResource, NullableDate } from "../types/domain";

class Admin implements AdminResource {
	constructor(
		public id: number,
		public name: string,
		public email: string,
		public password_hash: string,
		public last_login: NullableDate,
		public created_at: NullableDate,
		public updated_at: NullableDate,
		public deleted_at: NullableDate,
	) {}
}

module.exports = Admin;
