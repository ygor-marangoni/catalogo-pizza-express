/**
 * @param {object} product
 * @param {{variantId?: string|null, addonSelections?: Record<string, string[]>}} configuration
 */
export function validateProductConfiguration(product, configuration = {}) {
  const errors = {};
  if (!product.available) errors.product = "Este produto está indisponível no momento.";

  if (product.variants?.length) {
    const variant = product.variants.find((item) => item.id === configuration.variantId && item.available !== false);
    if (!variant) errors.variant = "Selecione uma variação disponível.";
  }

  for (const group of product.addonGroups || []) {
    const selected = configuration.addonSelections?.[group.id] || [];
    const validIds = new Set(group.options.filter((option) => option.available !== false).map((option) => option.id));
    const uniqueSelection = [...new Set(selected)];
    const validSelection = uniqueSelection.filter((id) => validIds.has(id));
    if (validSelection.length !== uniqueSelection.length) errors[group.id] = "Uma opção selecionada não está disponível.";
    else if (validSelection.length < group.min) errors[group.id] = `Escolha pelo menos ${group.min} opção(ões).`;
    else if (validSelection.length > group.max) errors[group.id] = `Escolha no máximo ${group.max} opção(ões).`;
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

/** @param {object} product @param {string|null|undefined} variantId */
export function calculateVariantPrice(product, variantId) {
  if (!product.variants?.length) return product.basePriceInCents;
  const variant = product.variants.find((item) => item.id === variantId && item.available !== false);
  if (!variant) throw new Error("Variação inválida.");
  return variant.priceInCents;
}

/** @param {object} product @param {Record<string, string[]>} selections */
export function calculateAddonsPrice(product, selections = {}) {
  return (product.addonGroups || []).reduce((total, group) => {
    const selected = new Set(selections[group.id] || []);
    return total + group.options
      .filter((option) => option.available !== false && selected.has(option.id))
      .reduce((groupTotal, option) => groupTotal + option.priceInCents, 0);
  }, 0);
}

/** @param {object} product @param {object} configuration */
export function calculateProductUnitPrice(product, configuration = {}) {
  return calculateVariantPrice(product, configuration.variantId) + calculateAddonsPrice(product, configuration.addonSelections);
}

/** @param {object} item */
export function calculateItemTotal(item) {
  if (!Number.isInteger(item.quantity) || item.quantity < 1) throw new Error("Quantidade inválida.");
  return item.unitPriceInCents * item.quantity;
}

/** @param {Array<object>} items */
export function calculateCartSubtotal(items) {
  return items.reduce((total, item) => total + calculateItemTotal(item), 0);
}

/**
 * Cria um snapshot estável para o carrinho.
 * @param {object} product
 * @param {{variantId?: string|null, addonSelections?: Record<string, string[]>, quantity: number, note?: string}} configuration
 */
export function buildCartItem(product, configuration) {
  const validation = validateProductConfiguration(product, configuration);
  if (!validation.valid) throw new Error(Object.values(validation.errors)[0]);
  if (!Number.isInteger(configuration.quantity) || configuration.quantity < 1 || configuration.quantity > 99) throw new Error("Quantidade inválida.");

  const variant = product.variants?.find((item) => item.id === configuration.variantId) || null;
  const addons = (product.addonGroups || []).flatMap((group) => {
    const selected = new Set(configuration.addonSelections?.[group.id] || []);
    return group.options.filter((option) => option.available !== false && selected.has(option.id)).map((option) => ({
      groupId: group.id,
      groupName: group.name,
      optionId: option.id,
      name: option.name,
      priceInCents: option.priceInCents,
    }));
  });
  const normalizedNote = (configuration.note || "").trim().slice(0, 300);
  const keyParts = [product.id, variant?.id || "base", ...addons.map((item) => item.optionId).sort(), normalizedNote];

  return {
    id: keyParts.join("::"),
    productId: product.id,
    productSlug: product.slug,
    name: product.name,
    image: product.images[0],
    variant: variant ? { id: variant.id, name: variant.name } : null,
    addons,
    note: normalizedNote,
    quantity: configuration.quantity,
    unitPriceInCents: calculateProductUnitPrice(product, configuration),
  };
}

/** @param {Array<object>} items @param {object} incoming */
export function addOrMergeCartItem(items, incoming) {
  const existing = items.find((item) => item.id === incoming.id);
  if (!existing) return [...items, incoming];
  return items.map((item) => item.id === incoming.id ? { ...item, quantity: Math.min(99, item.quantity + incoming.quantity) } : item);
}

/** @param {Array<object>} items @param {string} itemId @param {object} replacement */
export function replaceCartItem(items, itemId, replacement) {
  const remainingItems = items.filter((item) => item.id !== itemId);
  if (remainingItems.length === items.length) return items;
  return addOrMergeCartItem(remainingItems, replacement);
}

/** @param {Array<object>} items @param {string} itemId @param {number} quantity */
export function updateCartItemQuantity(items, itemId, quantity) {
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) throw new Error("Quantidade inválida.");
  return items.map((item) => item.id === itemId ? { ...item, quantity } : item);
}
