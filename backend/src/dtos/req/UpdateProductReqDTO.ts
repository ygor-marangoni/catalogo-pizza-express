export interface UpdateProductReqDTO {
	name?: string;
	description?: string | null;
	category_id?: number;
	base_price?: number;
	image_url?: string | null;
	available?: boolean;
	highlighted?: boolean;
}
