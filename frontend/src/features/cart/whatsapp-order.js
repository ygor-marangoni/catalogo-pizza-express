import { formatCurrency } from "@/lib/currency";
import { calculateItemTotal } from "./cart-domain";

export function normalizePhone(value) {
  return String(value || "").replace(/\D/g, "");
}

export function calculateOrderTotal(subtotalInCents, fulfillment, deliveryFeeInCents = 0, discountInCents = 0) {
  return Math.max(0, subtotalInCents - discountInCents) + (fulfillment === "delivery" ? deliveryFeeInCents : 0);
}

export function buildWhatsAppOrderMessage({ storeName, customer, items, subtotalInCents, deliveryFeeInCents = 0, coupon = null }) {
  const delivery = customer.fulfillment === "delivery";
  const discount = coupon?.discount_in_cents || 0;
  const total = calculateOrderTotal(subtotalInCents, customer.fulfillment, deliveryFeeInCents, discount);
  const lines = [
    `*NOVO PEDIDO - ${String(storeName || "PIZZA EXPRESS").toUpperCase()}*`,
    "--------------------------------",
    "",
    "*DADOS DO CLIENTE*",
    `Nome: ${customer.name}`,
    `Telefone: ${customer.phone}`,
    `Atendimento: ${delivery ? "Entrega" : "Retirada no local"}`,
  ];

  if (delivery) lines.push(`Endereço: ${customer.address}`);
  lines.push(`Pagamento: ${customer.payment}`);
  if (customer.change) lines.push(`Troco para: ${customer.change}`);
  lines.push("", "*ITENS DO PEDIDO*");

  items.forEach((item, index) => {
    lines.push("", `${index + 1}. *${item.quantity}x ${item.name}*`);
    if (item.variant) lines.push(`Tamanho: ${item.variant.name}`);
    const grouped = (item.addons || []).reduce((groups, addon) => {
      const values = groups.get(addon.groupName) || [];
      groups.set(addon.groupName, [...values, addon.name]);
      return groups;
    }, new Map());
    grouped.forEach((values, groupName) => lines.push(`${groupName}: ${values.join(", ")}`));
    if (item.note) lines.push(`Observação do item: ${item.note}`);
    lines.push(`Valor: ${formatCurrency(calculateItemTotal(item))}`);
  });

  lines.push(
    "",
    "--------------------------------",
    `Subtotal: ${formatCurrency(subtotalInCents)}`,
  );
  if (delivery) lines.push(`Taxa de entrega: ${formatCurrency(deliveryFeeInCents)}`);
  if (coupon) lines.push(`Cupom ${coupon.code}: -${formatCurrency(discount)}`);
  lines.push(`*TOTAL ESTIMADO: ${formatCurrency(total)}*`);
  if (customer.notes) lines.push("", `Observações gerais: ${customer.notes}`);
  lines.push("", "Pedido enviado pelo cardápio digital.", "Aguardo a confirmação da loja.");
  return lines.join("\n");
}

export function buildWhatsAppOrderUrl(whatsapp, order) {
  const phone = normalizePhone(whatsapp);
  if (!phone) throw new Error("WhatsApp da loja não configurado.");
  return `https://wa.me/${phone}?text=${encodeURIComponent(buildWhatsAppOrderMessage(order))}`;
}
