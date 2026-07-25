import type { NullableDate, SizeResDTO } from "../dtos/res";

class SizeModel implements SizeResDTO {
	constructor(
		public id: number,
		public name: string,
		public code: string,
		public description: string | null,
		public additional_price: number,
		public created_at: NullableDate,
		public updated_at: NullableDate,
		public deleted_at: NullableDate,
	) {}
}

module.exports = SizeModel;
