import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity("stores")
export class Store {
	@PrimaryColumn()
	id: number;

	@Column({ length: 160 })
	name: string;

	@Column({ type: "text", nullable: true })
	description: string | null;

	@Column({ length: 40, nullable: true })
	phone: string | null;

	@Column({ nullable: true })
	email: string | null;

	@Column({ type: "text", nullable: true })
	address: string | null;

	@Column({ type: "text", nullable: true })
	opening_hours: string | null;

	@Column({ default: true })
	is_open: boolean;

	@Column({ type: "integer", default: 0 })
	delivery_fee: number;

	@Column({ type: "integer", default: 0 })
	min_order_value: number;

	@Column({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
	created_at: Date;

	@Column({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
	updated_at: Date;
}
