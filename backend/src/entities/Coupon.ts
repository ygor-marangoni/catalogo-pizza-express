import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "./BaseEntity";

@Entity("coupons")
export class Coupon extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ length: 40 })
	code: string;

	@Column({ type: "text", nullable: true })
	description: string | null;

	@Column({ type: "varchar", length: 16 })
	discount_type: "PERCENTAGE" | "FIXED";

	@Column({ type: "integer" })
	discount_value: number;

	@Column({ type: "integer", default: 0 })
	min_order_value: number;

	@Column({ default: true })
	active: boolean;

	@Column({ type: "timestamptz", nullable: true })
	expires_at: Date | null;
}
