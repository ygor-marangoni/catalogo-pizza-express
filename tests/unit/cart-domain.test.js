import { describe, expect, it } from "vitest";
import {
  addOrMergeCartItem,
  buildCartItem,
  calculateAddonsPrice,
  calculateCartSubtotal,
  calculateItemTotal,
  calculateProductUnitPrice,
  calculateVariantPrice,
  updateCartItemQuantity,
  validateProductConfiguration,
} from "@/features/cart/cart-domain";
import { products } from "@/fixtures/catalog/products";

const configurable = products.find((product) => product.slug === "serra-dourada");

describe("domínio do carrinho", () => {
  it("calcula o preço da variação", () => {
    expect(calculateVariantPrice(configurable, "large")).toBe(6490);
  });

  it("calcula adicionais sem duplicar opções", () => {
    const selections = { crust: ["catupiry"], extras: ["basil", "basil", "garlic"] };
    expect(calculateAddonsPrice(configurable, selections)).toBe(1600);
    expect(calculateProductUnitPrice(configurable, { variantId: "medium", addonSelections: selections })).toBe(6890);
  });

  it("exige variação e grupo obrigatório", () => {
    const result = validateProductConfiguration(configurable, {});
    expect(result.valid).toBe(false);
    expect(result.errors.variant).toMatch(/Selecione/);
    expect(result.errors.crust).toMatch(/pelo menos 1/);
  });

  it("valida limite máximo do grupo", () => {
    const result = validateProductConfiguration(configurable, {
      variantId: "medium",
      addonSelections: { crust: ["traditional"], extras: ["basil", "mozzarella", "olives", "garlic"] },
    });
    expect(result.errors.extras).toMatch(/máximo 3/);
  });

  it("rejeita adicionais inexistentes ou indisponíveis", () => {
    const result = validateProductConfiguration(configurable, {
      variantId: "medium",
      addonSelections: { crust: ["traditional"], extras: ["unknown-option"] },
    });
    expect(result.valid).toBe(false);
    expect(result.errors.extras).toMatch(/não está disponível/);
  });

  it("impede produto indisponível", () => {
    const unavailable = products.find((product) => !product.available);
    expect(validateProductConfiguration(unavailable, {}).errors.product).toMatch(/indisponível/);
  });

  it("cria snapshot, total do item e subtotal", () => {
    const item = buildCartItem(configurable, { variantId: "medium", addonSelections: { crust: ["traditional"] }, quantity: 2, note: "  bem assada  " });
    expect(item.note).toBe("bem assada");
    expect(item.unitPriceInCents).toBe(5290);
    expect(calculateItemTotal(item)).toBe(10580);
    expect(calculateCartSubtotal([item, { ...item, id: "other", quantity: 1 }])).toBe(15870);
  });

  it("adiciona, mescla, edita e remove itens", () => {
    const item = buildCartItem(configurable, { variantId: "medium", addonSelections: { crust: ["traditional"] }, quantity: 1 });
    const added = addOrMergeCartItem([], item);
    expect(added).toHaveLength(1);
    const merged = addOrMergeCartItem(added, item);
    expect(merged[0].quantity).toBe(2);
    const edited = updateCartItemQuantity(merged, item.id, 3);
    expect(edited[0].quantity).toBe(3);
    expect(edited.filter((entry) => entry.id !== item.id)).toHaveLength(0);
  });
});
