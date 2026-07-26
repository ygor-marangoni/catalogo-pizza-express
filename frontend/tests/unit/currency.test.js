import { describe, expect, it } from "vitest";
import { centsToInput, formatCurrency, reaisToCents } from "@/lib/currency";

describe("formatCurrency", () => {
  it("formata centavos em BRL", () => {
    expect(formatCurrency(4690)).toContain("46,90");
  });

  it("converte reais para centavos sem persistir ponto flutuante", () => {
    expect(reaisToCents("49,90")).toBe(4990);
    expect(centsToInput(4990)).toBe("49,90");
  });

  it("recusa números decimais", () => {
    expect(() => formatCurrency(46.9)).toThrow(/inteiro/);
  });
});
