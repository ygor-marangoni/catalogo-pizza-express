import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity("product_additionals")
@Unique(["product_id", "additional_id"])
export class ProductAdditional {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	product_id: number;

	@Column()
	additional_id: number;
}
