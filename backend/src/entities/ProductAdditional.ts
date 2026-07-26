import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity("product_additionals")
export class ProductAdditional {
	@PrimaryColumn()
	product_id: number;

	@PrimaryColumn()
	additional_id: number;

	@Column({ type: "integer", nullable: true })
	price_override: number | null;

	@Column({ default: true })
	available: boolean;
}
