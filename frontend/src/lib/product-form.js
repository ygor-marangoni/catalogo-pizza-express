export function productFormToMultipart(form, image) {
  const body = new FormData();
  const fields = {
    name: form.name.trim(),
    description: form.description.trim() || "",
    category_id: Number(form.category_id),
    base_price: Number(form.base_price),
    available: Boolean(form.available),
    highlighted: Boolean(form.highlighted),
    size_ids: JSON.stringify(form.size_ids),
    edge_ids: JSON.stringify(form.edge_ids),
    additional_ids: JSON.stringify(form.additional_ids),
  };
  Object.entries(fields).forEach(([key, value]) => body.append(key, String(value)));
  if (image) body.append("image", image);
  return body;
}

export function formatCentsInput(value) {
  return (Number(value || 0) / 100).toFixed(2).replace(".", ",");
}

export function parseCentsInput(value) {
  const normalized = String(value ?? "").trim().replace(/\./g, "").replace(",", ".");
  const amount = Number(normalized);
  if (!Number.isFinite(amount) || amount < 0) throw new Error("Informe um valor monetário válido e não negativo.");
  return Math.round(amount * 100);
}
