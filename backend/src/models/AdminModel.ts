import type { AdminResDTO, NullableDate } from "../dtos/res";

class AdminModel implements AdminResDTO {
	constructor(
		public id: number,
		public name: string,
		public email: string,
		public password_hash: string,
		public created_at: NullableDate,
		public updated_at: NullableDate,
		public deleted_at: NullableDate,
	) {}
}

module.exports = AdminModel;
