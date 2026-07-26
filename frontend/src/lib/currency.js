export function formatCurrency(valueInCents) {
  if (!Number.isInteger(valueInCents)) throw new TypeError("O valor deve ser inteiro em centavos.");
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valueInCents / 100);
}

export function reaisToCents(value) {
  const normalized = String(value ?? "").trim().replace(/\s/g, "").replace(/^R\$/, "").replace(/\./g, "").replace(",", ".");
  if (!/^\d+(\.\d{1,2})?$/.test(normalized)) throw new TypeError("Informe um valor válido em reais.");
  const [integer, decimal = ""] = normalized.split(".");
  return Number(integer) * 100 + Number(decimal.padEnd(2, "0"));
}

export function centsToInput(value) {
  return (Number(value || 0) / 100).toFixed(2).replace(".", ",");
}
