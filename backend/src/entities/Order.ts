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

	@Column({ type: "varchar", length: 20, nullable: true })
	fulfillment: string | null;

	@Column({ type: "varchar", length: 40, nullable: true })
	phone: string | null;

	@Column({ type: "text", nullable: true })
	address: string | null;

	@Column({ type: "varchar", length: 30, nullable: true })
	payment: string | null;

	@Column({ type: "text", nullable: true })
	notes: string | null;

	@Column({ type: "integer", default: 0 })
	delivery_fee: number;

	@Column({ type: "integer", default: 0 })
	discount: number;

	@Column({ type: "varchar", length: 40, nullable: true })
	coupon_code: string | null;
}
