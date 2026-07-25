/** @param {string} value */
export function normalizeSearchTerm(value = "") {
  return value.trim().toLocaleLowerCase("pt-BR").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

/**
 * @param {object} product
 * @param {string} term
 * @param {Array<object>} categories
 */
export function productMatchesSearch(product, term, categories) {
  const normalized = normalizeSearchTerm(term);
  if (!normalized) return true;
  const category = categories.find((item) => item.id === product.categoryId);
  const content = [product.name, product.shortDescription, product.description, category?.name, ...(product.tags || [])]
    .map(normalizeSearchTerm)
    .join(" ");
  return normalized.split(/\s+/).every((piece) => content.includes(piece));
}

/** @param {Array<object>} items @param {string} order */
export function sortProducts(items, order = "featured") {
  const copy = [...items];
  if (order === "price-asc") return copy.sort((a, b) => getStartingPrice(a) - getStartingPrice(b));
  if (order === "price-desc") return copy.sort((a, b) => getStartingPrice(b) - getStartingPrice(a));
  if (order === "alphabetical") return copy.sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
  return copy.sort((a, b) => Number(b.featured) - Number(a.featured) || Number(b.popular) - Number(a.popular));
}

/** @param {object} product */
export function getStartingPrice(product) {
  const availableVariants = (product.variants || []).filter((variant) => variant.available !== false);
  if (availableVariants.length) return Math.min(...availableVariants.map((variant) => variant.priceInCents));
  return product.basePriceInCents;
}
