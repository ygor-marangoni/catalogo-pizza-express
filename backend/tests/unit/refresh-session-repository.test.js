import { describe, expect, it } from "vitest";
import { RefreshSessionRepository } from "../../src/repositories/RefreshSessionRepository";

describe("RefreshSessionRepository", () => {
  it("armazena somente o hash, permite uma sessao ativa e revoga a anterior", async () => {
    const repository = new RefreshSessionRepository();
    const token = RefreshSessionRepository.createToken();
    await repository.create(token, 10, "CUSTOMER", new Date(Date.now() + 60_000));
    expect((await repository.findActive(token))?.token_hash).not.toBe(token);
    await repository.revoke(token);
    expect(await repository.findActive(token)).toBeNull();
  });
});
