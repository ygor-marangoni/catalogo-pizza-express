"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { useCart } from "@/contexts/CartContext";
import { apiRequest } from "@/lib/api/api-client";
import { mapProducts } from "@/repositories/catalog/catalog-mappers";

const ProductCustomizationModal = dynamic(
  () => import("./ProductCustomizationModal").then((module) => module.ProductCustomizationModal),
  { ssr: false },
);

export function ProductModalController({ productIndex, localProducts, categories }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { cart, editingItemId, cancelEditing, openCart } = useCart();
  const slug = searchParams.get("produto");
  const [loadedProduct, setLoadedProduct] = useState(null);
  const requestRef = useRef(0);
  const productReference = productIndex.find((item) => item.slug === slug) || null;
  const localProduct = localProducts?.find((item) => item.slug === slug) || null;
  const product = localProduct || (loadedProduct?.slug === slug ? loadedProduct.value : null);
  const editingItem = editingItemId
    ? cart.items.find((item) => item.id === editingItemId && item.productSlug === slug) || null
    : null;
  const previousSlugRef = useRef(slug);
  const openedFromCatalogRef = useRef(false);
  const openCartAfterCloseRef = useRef(false);

  useEffect(() => {
    const requestId = requestRef.current + 1;
    requestRef.current = requestId;
    if (!productReference || localProducts) return;
    Promise.all([
      apiRequest(`/products/${productReference.id}`, { skipAuth: true }),
      apiRequest(`/products/${productReference.id}/configuration`, { skipAuth: true }),
    ]).then(([rawProduct, configuration]) => {
      if (requestRef.current !== requestId) return;
      const mapped = mapProducts([rawProduct], categories, {
        configurations: new Map([[String(rawProduct.id), configuration]]),
      })[0];
      setLoadedProduct({ slug: productReference.slug, value: { ...mapped, slug: productReference.slug } });
    }).catch(() => {});
  }, [categories, localProducts, productReference]);

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
