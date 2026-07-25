import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "./BaseEntity";

@Entity("sizes")
export class Size extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ length: 80 })
	name: string;

	@Column({ length: 40, unique: true })
	code: string;

	@Column({ type: "text", nullable: true })
	description: string | null;

	@Column({ type: "integer", default: 0 })
	additional_price: number;
}
