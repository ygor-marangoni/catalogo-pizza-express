export interface CreateOrderReqDTO {
	items: Array<{
		product_id: number;
		quantity: number;
		size_id?: number;
		edge_id?: number | null;
		additional_ids?: number[];
		note?: string;
	}>;
}
