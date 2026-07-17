import { describe, expect, it } from "vitest";
import { formatCurrency } from "@/lib/currency";

describe("formatCurrency", () => {
  it("formata centavos em BRL", () => {
    expect(formatCurrency(4690)).toContain("46,90");
  });

  it("recusa números decimais", () => {
    expect(() => formatCurrency(46.9)).toThrow(/inteiro/);
  });
});
