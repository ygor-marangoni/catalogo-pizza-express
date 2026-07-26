"use client";

import { Suspense } from "react";
import { CartProvider } from "@/contexts/CartContext";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductModalController } from "@/components/catalog/ProductModalController";

export function StorefrontShell({
  children,
  store,
  headerStore,
  productIndex,
  searchSuggestions,
  categories,
}) {
  return <CartProvider storeId={store.id} storeInfo={store}>
    <Header store={headerStore} suggestions={searchSuggestions} categories={categories} />
    <Suspense fallback={null}>
      <ProductModalController productIndex={productIndex} categories={categories} />
    </Suspense>
    <main id="conteudo">{children}</main>
    <Footer store={store} />
  </CartProvider>;
}
