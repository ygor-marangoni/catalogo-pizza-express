export function slugify(value) {
  return String(value || "")
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase().replace(/&/g, " e ")
    .replace(/[^a-z0-9]+/g, "-").replace(/-{2,}/g, "-").replace(/^-|-$/g, "");
}

export function assignUniqueSlugs(items) {
  const seen = new Set();
  return items.map((item) => {
    const base = slugify(item.name) || String(item.id);
    const slug = seen.has(base) ? `${base}-${item.id}` : base;
    seen.add(slug);
    return { ...item, slug };
  });
}
