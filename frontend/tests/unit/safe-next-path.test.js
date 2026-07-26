import { describe, expect, it } from "vitest";
import { getSafeNextPath } from "@/lib/navigation/safe-next-path";

describe("getSafeNextPath", () => {
  it("preserva somente destinos internos", () => {
    expect(getSafeNextPath("/carrinho?finalizar=1", "/conta")).toBe("/carrinho?finalizar=1");
    expect(getSafeNextPath("/conta/favoritos", "/conta")).toBe("/conta/favoritos");
  });

  it.each([
    "https://site-malicioso.example",
    "//site-malicioso.example",
    "/\\site-malicioso.example",
    "javascript:alert(1)",
    "",
    null,
  ])("recusa destino externo ou inválido: %s", (value) => {
    expect(getSafeNextPath(value, "/conta")).toBe("/conta");
  });
});
