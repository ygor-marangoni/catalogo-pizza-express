import type { NullableDate, StoreResDTO } from "../dtos/res";

class StoreModel implements StoreResDTO {
	constructor(
		public id: number,
		public name: string,
		public description: string | null,
		public phone: string | null,
		public email: string | null,
		public address: string | null,
		public opening_hours: string | null,
		public estimated_time: string | null,
		public is_open: boolean,
		public delivery_fee: number,
		public min_order_value: number,
		public created_at: NullableDate,
		public updated_at: NullableDate,
	) {}
}

module.exports = StoreModel;
