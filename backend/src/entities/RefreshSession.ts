import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Entity("refresh_sessions")
export class RefreshSession {
  @PrimaryGeneratedColumn()
  id: number;
  @Index({ unique: true })
  @Column({ type: "varchar", length: 128 })
  token_hash: string;
  @Column() account_id: number;
  @Column({ length: 20 }) role: "ADMIN" | "CUSTOMER";
  @Column({ type: "timestamptz" }) expires_at: Date;
  @Column({ type: "timestamptz", nullable: true }) revoked_at: Date | null;
  @Column({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" }) created_at: Date;
}
