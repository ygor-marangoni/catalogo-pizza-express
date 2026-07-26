import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity("product_edges")
@Unique(["product_id", "edge_id"])
export class ProductEdge {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	product_id: number;

	@Column()
	edge_id: number;
}
