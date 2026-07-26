import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity("product_edges")
export class ProductEdge {
	@PrimaryColumn()
	product_id: number;

	@PrimaryColumn()
	edge_id: number;

	@Column({ type: "integer", nullable: true })
	price_override: number | null;

	@Column({ default: true })
	available: boolean;
}
