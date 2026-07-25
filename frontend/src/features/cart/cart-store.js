"use client";

import { createEmptyCart, loadCart, saveCart } from "./cart-storage";

const stores = new Map();

/**
 * Cria uma store externa por loja para que o primeiro snapshot hidratado seja
 * exatamente o mesmo do servidor. O localStorage só é consultado pelo snapshot
 * cliente depois que a hidratação inicial termina.
 *
 * @param {string} storeId
 */
export function getCartStore(storeId) {
  if (stores.has(storeId)) return stores.get(storeId);

  const listeners = new Set();
  const serverSnapshot = createEmptyCart(storeId);
  let clientSnapshot = null;

  const store = {
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    getServerSnapshot() {
      return serverSnapshot;
    },
    getSnapshot() {
      if (clientSnapshot === null) clientSnapshot = loadCart(window.localStorage, storeId);
      return clientSnapshot;
    },
    /** @param {object | ((cart: object) => object)} updater */
    commit(updater) {
      const current = store.getSnapshot();
      const next = typeof updater === "function" ? updater(current) : updater;
      clientSnapshot = saveCart(window.localStorage, next);
      listeners.forEach((listener) => listener());
    },
  };

  stores.set(storeId, store);
  return store;
}
