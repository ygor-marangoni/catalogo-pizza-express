import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "./BaseEntity";

@Entity("additionals")
export class Additional extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ length: 120 })
	name: string;

	@Column({ type: "text", nullable: true })
	description: string | null;

	@Column({ type: "integer", default: 0 })
	price: number;
}
