import type { EdgeResource, NullableDate } from "../types/domain";

class Edge implements EdgeResource {
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

module.exports = Edge;
