export const CART_STORAGE_KEY = "pizza-express:cart";
export const LEGACY_CART_STORAGE_KEY = "forno-afeto:cart";
export const CART_VERSION = 1;

/** @param {Array<object>} items */
function validItems(items) {
  return Array.isArray(items) ? items.filter((item) => item
    && typeof item.id === "string"
    && Number.isInteger(item.quantity)
    && item.quantity > 0
    && item.quantity <= 99
    && Number.isInteger(item.unitPriceInCents)
    && item.unitPriceInCents >= 0) : [];
}

/** @param {unknown} payload @param {string} storeId */
export function migrateCart(payload, storeId = "pizza-express") {
  if (!payload || typeof payload !== "object") return createEmptyCart(storeId);
  if (payload.version === CART_VERSION && payload.storeId === storeId) {
    return { ...createEmptyCart(storeId), ...payload, items: validItems(payload.items) };
  }
  if ((payload.version === 0 || payload.version == null) && Array.isArray(payload.items)) {
    return { ...createEmptyCart(storeId), items: validItems(payload.items) };
  }
  return createEmptyCart(storeId);
}

/** @param {string} storeId */
export function createEmptyCart(storeId = "pizza-express") {
  return { version: CART_VERSION, storeId, items: [], updatedAt: new Date(0).toISOString() };
}

/** @param {{getItem: Function}} storage @param {string} storeId */
export function loadCart(storage, storeId = "pizza-express") {
  try {
    const raw = storage.getItem(CART_STORAGE_KEY) || storage.getItem(LEGACY_CART_STORAGE_KEY);
    return raw ? migrateCart(JSON.parse(raw), storeId) : createEmptyCart(storeId);
  } catch {
    return createEmptyCart(storeId);
  }
}

/** @param {{setItem: Function}} storage @param {object} cart */
export function saveCart(storage, cart) {
  const payload = { ...cart, version: CART_VERSION, updatedAt: new Date().toISOString() };
  try {
    storage.setItem(CART_STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // Mantém o carrinho utilizável em memória quando o armazenamento está indisponível ou cheio.
  }
  return payload;
}
