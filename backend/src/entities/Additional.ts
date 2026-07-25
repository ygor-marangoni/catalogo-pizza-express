import type { AdditionalResource, NullableDate } from "../types/domain";

class Additional implements AdditionalResource {
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

module.exports = Additional;
