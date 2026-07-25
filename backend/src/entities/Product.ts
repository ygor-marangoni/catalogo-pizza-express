import type { NullableDate, ProductResource } from "../types/domain";

class Product implements ProductResource {
	constructor(
		public id: number,
		public name: string,
		public description: string | null,
		public category_id: number,
		public base_price: number,
		public image_url: string | null,
		public available: boolean,
		public highlighted: boolean,
		public created_at: NullableDate,
		public updated_at: NullableDate,
		public deleted_at: NullableDate,
	) {}
}

module.exports = Product;
