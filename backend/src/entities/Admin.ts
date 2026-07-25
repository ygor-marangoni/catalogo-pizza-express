import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "./BaseEntity";

@Entity("admins")
export class Admin extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ length: 120 })
	name: string;

	@Column({ unique: true })
	email: string;

	@Column({ type: "text" })
	password_hash: string;

}
