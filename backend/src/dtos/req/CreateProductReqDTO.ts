export interface CreateProductReqDTO {
	name: string;
	description?: string | null;
	category_id: number;
	base_price: number;
	image_url?: string | null;
	available?: boolean;
	highlighted?: boolean;
	size_ids?: number[];
	edge_ids?: number[];
	additional_ids?: number[];
}
