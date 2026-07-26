import { describe, expect, it } from "vitest";
import { buildProductConfiguration } from "@/repositories/catalog/catalog-mappers";

describe("mapeamento da configuração individual do produto", () => {
  it("aplica preço final, tamanho padrão e exceções sem alterar o preço global", () => {
    const configuration = {
      sizes: [
        { size_id: 1, name: "M", code: "M", price: 4590, is_default: true, available: true },
        { size_id: 2, name: "G", code: "G", price: 5990, is_default: false, available: true },
      ],
      edges: [
        { edge_id: 3, name: "Catupiry", global_price: 800, price_override: 1000, price: 1000, available: true },
      ],
      additionals: [
        { additional_id: 4, name: "Bacon", global_price: 700, price_override: null, price: 700, available: true },
      ],
    };

    const mapped = buildProductConfiguration({ base_price: 4590 }, { name: "Pizzas" }, configuration);

    expect(mapped.defaultVariantId).toBe("1");
    expect(mapped.variants.map((item) => item.priceInCents)).toEqual([4590, 5990]);
    expect(mapped.addonGroups[0].options[0]).toMatchObject({
      priceInCents: 1000,
      globalPriceInCents: 800,
      hasPriceOverride: true,
    });
    expect(mapped.addonGroups[1].options[0]).toMatchObject({
      priceInCents: 700,
      globalPriceInCents: 700,
      hasPriceOverride: false,
    });
  });
});
