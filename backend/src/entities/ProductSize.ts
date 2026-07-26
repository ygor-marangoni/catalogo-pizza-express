import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity("product_sizes")
@Unique(["product_id", "size_id"])
export class ProductSize {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	product_id: number;

	@Column()
	size_id: number;
}
