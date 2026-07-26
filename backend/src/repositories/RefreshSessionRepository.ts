import { createHash, randomBytes } from "node:crypto";
import { IsNull } from "typeorm";
import { AppDataSource } from "../config/ormConfig";
import { RefreshSession } from "../entities/RefreshSession";

type Session = { token_hash: string; account_id: number; role: "ADMIN" | "CUSTOMER"; expires_at: Date; revoked_at: Date | null };
export class RefreshSessionRepository {
  private readonly memory = new Map<string, Session>();
  static createToken() { return randomBytes(48).toString("base64url"); }
  static hashToken(token: string) { return createHash("sha256").update(token).digest("hex"); }
  async create(token: string, account_id: number, role: "ADMIN" | "CUSTOMER", expires_at: Date) {
    const session = { token_hash: RefreshSessionRepository.hashToken(token), account_id, role, expires_at, revoked_at: null };
    if (!AppDataSource.isInitialized) { this.memory.set(session.token_hash, session); return session; }
    return AppDataSource.getRepository(RefreshSession).save(session);
  }
  async findActive(token: string): Promise<Session | null> {
    const hash = RefreshSessionRepository.hashToken(token);
    if (!AppDataSource.isInitialized) {
      const session = this.memory.get(hash);
      return session && !session.revoked_at && session.expires_at > new Date() ? session : null;
    }
    return AppDataSource.getRepository(RefreshSession).findOne({ where: { token_hash: hash, revoked_at: IsNull() } }) as Promise<Session | null>;
  }
  async revoke(token: string) {
    const hash = RefreshSessionRepository.hashToken(token);
    if (!AppDataSource.isInitialized) { const session = this.memory.get(hash); if (session) session.revoked_at = new Date(); return; }
    await AppDataSource.getRepository(RefreshSession).update({ token_hash: hash, revoked_at: IsNull() }, { revoked_at: new Date() });
  }
}
