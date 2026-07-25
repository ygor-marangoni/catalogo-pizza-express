import type { AdditionalResDTO, NullableDate } from "../dtos/res";

class AdditionalModel implements AdditionalResDTO {
	constructor(
		public id: number,
		public name: string,
		public description: string | null,
		public price: number,
		public created_at: NullableDate,
		public updated_at: NullableDate,
		public deleted_at: NullableDate,
	) {}
}

module.exports = AdditionalModel;
