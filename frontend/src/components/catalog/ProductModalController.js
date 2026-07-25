"use client";

import { useCallback, useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { useCart } from "@/contexts/CartContext";

const ProductCustomizationModal = dynamic(
  () => import("./ProductCustomizationModal").then((module) => module.ProductCustomizationModal),
  { ssr: false },
);

export function ProductModalController({ products }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { cart, editingItemId, cancelEditing, openCart } = useCart();
  const slug = searchParams.get("produto");
  const product = products.find((item) => item.slug === slug) || null;
  const editingItem = editingItemId
    ? cart.items.find((item) => item.id === editingItemId && item.productSlug === slug) || null
    : null;
  const previousSlugRef = useRef(slug);
  const openedFromCatalogRef = useRef(false);
  const openCartAfterCloseRef = useRef(false);

  useEffect(() => {
    const previousSlug = previousSlugRef.current;
    if (!previousSlug && slug) openedFromCatalogRef.current = true;
    if (previousSlug && !slug) {
      openedFromCatalogRef.current = false;
      cancelEditing();
      if (openCartAfterCloseRef.current) {
        openCartAfterCloseRef.current = false;
        openCart();
      }
    }
    previousSlugRef.current = slug;
  }, [slug, cancelEditing, openCart]);

  const close = useCallback(() => {
    cancelEditing();
    if (openedFromCatalogRef.current && window.history.length > 1) {
      router.back();
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    params.delete("produto");
    const query = params.toString();
    const nextUrl = query ? `${pathname}?${query}` : pathname;
    router.replace(nextUrl, { scroll: false });
  }, [cancelEditing, pathname, router, searchParams]);

  const complete = useCallback(({ mode } = {}) => {
    openCartAfterCloseRef.current = mode === "add";
    close();
  }, [close]);

  return product ? <ProductCustomizationModal product={product} editingItem={editingItem} onClose={close} onComplete={complete} /> : null;
}
