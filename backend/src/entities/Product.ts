import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "./BaseEntity";

@Entity("products")
export class Product extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ length: 160 })
	name: string;

	@Column({ type: "text", nullable: true })
	description: string | null;

	@Column()
	category_id: number;

	@Column({ type: "integer" })
	base_price: number;

	@Column({ type: "text", nullable: true })
	image_url: string | null;

	@Column({ default: true })
	available: boolean;

	@Column({ default: false })
	highlighted: boolean;

	@Column({ default: false })
	is_combo: boolean;
}
