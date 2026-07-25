const brlFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

/** @param {number} cents */
export function formatCurrency(cents) {
  if (!Number.isInteger(cents)) throw new TypeError("O valor monetário deve ser um inteiro em centavos.");
  return brlFormatter.format(cents / 100);
}
