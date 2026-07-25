import type { EdgeResDTO, NullableDate } from "../dtos/res";

class EdgeModel implements EdgeResDTO {
	constructor(
		public id: number,
		public name: string,
		public description: string | null,
		public additional_price: number,
		public created_at: NullableDate,
		public updated_at: NullableDate,
		public deleted_at: NullableDate,
	) {}
}

module.exports = EdgeModel;
