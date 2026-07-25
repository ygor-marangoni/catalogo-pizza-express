import type { CategoryResDTO, NullableDate } from "../dtos/res";

class CategoryModel implements CategoryResDTO {
	constructor(
		public id: number,
		public name: string,
		public description: string | null,
		public icon_url: string | null,
		public created_at: NullableDate,
		public updated_at: NullableDate,
		public deleted_at: NullableDate,
	) {}
}

module.exports = CategoryModel;
