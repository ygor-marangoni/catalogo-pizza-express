import type { NullableDate, ProductResDTO } from "../dtos/res";

class ProductModel implements ProductResDTO {
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

module.exports = ProductModel;
