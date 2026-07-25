import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "./BaseEntity";

@Entity("orders")
export class Order extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	user_id: number;

	@Column({ type: "jsonb" })
	items: unknown[];

	@Column({ type: "integer" })
	total: number;

	@Column({ length: 30, default: "PENDING" })
	status: string;
}
