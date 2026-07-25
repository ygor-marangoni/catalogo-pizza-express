import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";
import { BaseEntity } from "./BaseEntity";

@Entity("favorites")
@Unique(["user_id", "product_id"])
export class Favorite extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	user_id: number;

	@Column()
	product_id: number;
}
