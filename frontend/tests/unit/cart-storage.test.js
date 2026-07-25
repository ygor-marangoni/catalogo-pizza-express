import { describe, expect, it } from "vitest";
import { CART_STORAGE_KEY, CART_VERSION, LEGACY_CART_STORAGE_KEY, loadCart, migrateCart, saveCart } from "@/features/cart/cart-storage";

function memoryStorage() {
  const values = new Map();
  return { getItem: (key) => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) };
}

const validItem = { id: "item-1", quantity: 2, unitPriceInCents: 1200 };

describe("persistência do carrinho", () => {
  it("salva e carrega o formato v1", () => {
    const storage = memoryStorage();
    const saved = saveCart(storage, { version: 1, storeId: "pizza-express", items: [validItem], updatedAt: "" });
    expect(saved.version).toBe(CART_VERSION);
    expect(storage.getItem(CART_STORAGE_KEY)).toContain("item-1");
    expect(loadCart(storage).items).toEqual([validItem]);
  });

  it("migra estrutura legada sem versão", () => {
    const migrated = migrateCart({ items: [validItem] });
    expect(migrated.version).toBe(1);
    expect(migrated.items).toHaveLength(1);
  });

  it("recupera o carrinho salvo na chave antiga da marca", () => {
    const storage = memoryStorage();
    storage.setItem(LEGACY_CART_STORAGE_KEY, JSON.stringify({ version: 1, storeId: "pizza-express", items: [validItem] }));
    expect(loadCart(storage).items).toEqual([validItem]);
  });

  it("descarta quantidades e preços inválidos", () => {
    const invalidItems = [
      { ...validItem, id: "quantity", quantity: 100 },
      { ...validItem, id: "price", unitPriceInCents: -1 },
    ];
    expect(migrateCart({ version: 1, storeId: "pizza-express", items: invalidItems }).items).toEqual([]);
  });

  it("mantém o snapshot em memória quando o localStorage falha", () => {
    const storage = { setItem: () => { throw new Error("quota"); } };
    expect(saveCart(storage, { storeId: "pizza-express", items: [validItem] }).items).toEqual([validItem]);
  });

  it("recomeça com segurança em versão futura ou JSON inválido", () => {
    expect(migrateCart({ version: 99, items: [validItem] }).items).toEqual([]);
    const storage = { getItem: () => "{invalid", setItem: () => {} };
    expect(loadCart(storage).items).toEqual([]);
  });
});
