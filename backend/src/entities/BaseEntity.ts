import { Column } from "typeorm";

export abstract class BaseEntity {
	@Column({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
	created_at: Date;

	@Column({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
	updated_at: Date;

	@Column({ type: "timestamptz", nullable: true })
	deleted_at: Date | null;
}
