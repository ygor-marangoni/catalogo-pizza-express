import { describe, expect, it } from "vitest";
import {
  buildWhatsAppOrderMessage,
  buildWhatsAppOrderUrl,
  calculateOrderTotal,
  normalizePhone,
} from "@/features/cart/whatsapp-order";

const item = {
  name: "Pizza Especial",
  quantity: 2,
  unitPriceInCents: 4990,
  variant: { name: "Grande" },
  addons: [{ groupName: "Borda", name: "Catupiry" }],
  note: "Bem assada",
};

describe("pedido por WhatsApp", () => {
  it("normaliza telefone e soma taxa somente na entrega", () => {
    expect(normalizePhone("+55 (34) 99999-0000")).toBe("5534999990000");
    expect(calculateOrderTotal(9980, "delivery", 500)).toBe(10480);
    expect(calculateOrderTotal(9980, "pickup", 500)).toBe(9980);
  });

  it("gera mensagem diagramada sem emojis", () => {
    const message = buildWhatsAppOrderMessage({
      storeName: "Pizza Express",
      customer: {
        name: "Maria", phone: "(34) 99999-0000", fulfillment: "delivery",
        address: "Rua A, 10", payment: "Pix", notes: "Interfone 2",
      },
      items: [item],
      subtotalInCents: 9980,
      deliveryFeeInCents: 500,
    });
    expect(message).toContain("*NOVO PEDIDO - PIZZA EXPRESS*");
    expect(message).toContain("2x Pizza Especial");
    expect(message).toContain("Tamanho: Grande");
    expect(message).toContain("Borda: Catupiry");
    expect(message).toContain("*TOTAL ESTIMADO: R$ 104,80*");
    expect(message).not.toMatch(/[\u{1F300}-\u{1FAFF}]/u);
  });

  it("gera URL codificada para o WhatsApp da loja", () => {
    const url = buildWhatsAppOrderUrl("55 (34) 99999-0000", {
      storeName: "Pizza Express",
      customer: { name: "João", phone: "123", fulfillment: "pickup", payment: "Cartão" },
      items: [item],
      subtotalInCents: 9980,
    });
    expect(url).toMatch(/^https:\/\/wa\.me\/5534999990000\?text=/);
    expect(decodeURIComponent(url)).toContain("Retirada no local");
  });

  it("aplica e descreve o cupom no total", () => {
    const message = buildWhatsAppOrderMessage({
      storeName: "Pizza Express",
      customer: { name: "Ana", phone: "123", fulfillment: "pickup", payment: "Pix" },
      items: [item],
      subtotalInCents: 9980,
      coupon: { code: "PIZZA10", discount_in_cents: 998 },
    });
    expect(calculateOrderTotal(9980, "pickup", 0, 998)).toBe(8982);
    expect(message).toContain("Cupom PIZZA10: -R$");
    expect(message).toContain("*TOTAL ESTIMADO: R$");
  });
});
