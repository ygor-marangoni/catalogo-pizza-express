"use client";

import { createContext, useContext, useMemo, useState, useSyncExternalStore } from "react";
import { addOrMergeCartItem, calculateCartSubtotal, replaceCartItem, updateCartItemQuantity } from "@/features/cart/cart-domain";
import { getCartStore } from "@/features/cart/cart-store";

const CartContext = createContext(null);
const subscribeToHydration = () => () => {};

export function CartProvider({ children, storeId = "pizza-express" }) {
  const store = useMemo(() => getCartStore(storeId), [storeId]);
  const [editingItemId, setEditingItemId] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const cart = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);
  const hydrated = useSyncExternalStore(subscribeToHydration, () => true, () => false);

  const actions = useMemo(() => ({
    addItem: (item) => store.commit((current) => ({ ...current, items: addOrMergeCartItem(current.items, item) })),
    replaceItem: (itemId, item) => store.commit((current) => ({ ...current, items: replaceCartItem(current.items, itemId, item) })),
    updateQuantity: (itemId, quantity) => store.commit((current) => ({ ...current, items: updateCartItemQuantity(current.items, itemId, quantity) })),
    removeItem: (itemId) => store.commit((current) => ({ ...current, items: current.items.filter((item) => item.id !== itemId) })),
    clearCart: () => store.commit((current) => ({ ...current, items: [] })),
    startEditing: setEditingItemId,
    cancelEditing: () => setEditingItemId(null),
    openCart: () => setCartOpen(true),
    closeCart: () => setCartOpen(false),
  }), [store]);

  const value = useMemo(() => ({
    cart,
    hydrated,
    editingItemId,
    cartOpen,
    itemCount: cart.items.reduce((total, item) => total + item.quantity, 0),
    subtotalInCents: calculateCartSubtotal(cart.items),
    ...actions,
  }), [cart, hydrated, editingItemId, cartOpen, actions]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart deve ser usado dentro de CartProvider");
  return context;
}
