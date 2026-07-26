import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity("product_sizes")
export class ProductSize {
	@PrimaryColumn()
	product_id: number;

	@PrimaryColumn()
	size_id: number;

	@Column({ type: "integer" })
	price: number;

	@Column({ default: false })
	is_default: boolean;

	@Column({ default: true })
	available: boolean;
}
