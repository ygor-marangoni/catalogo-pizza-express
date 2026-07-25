import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "./BaseEntity";

@Entity("categories")
export class Category extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ length: 120 })
	name: string;

	@Column({ type: "text", nullable: true })
	description: string | null;

	@Column({ type: "text", nullable: true })
	icon_url: string | null;
}
