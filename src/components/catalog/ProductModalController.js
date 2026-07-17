"use client";

import { useCallback, useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";

const ProductCustomizationModal = dynamic(
  () => import("./ProductCustomizationModal").then((module) => module.ProductCustomizationModal),
  { ssr: false },
);

export function ProductModalController({ products }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = searchParams.get("produto");
  const product = products.find((item) => item.slug === slug) || null;
  const previousSlugRef = useRef(slug);
  const openedFromCatalogRef = useRef(false);

  useEffect(() => {
    const previousSlug = previousSlugRef.current;
    if (!previousSlug && slug) openedFromCatalogRef.current = true;
    if (previousSlug && !slug) openedFromCatalogRef.current = false;
    previousSlugRef.current = slug;
  }, [slug]);

  const close = useCallback(() => {
    if (openedFromCatalogRef.current && window.history.length > 1) {
      router.back();
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    params.delete("produto");
    const query = params.toString();
    const nextUrl = query ? `${pathname}?${query}` : pathname;
    router.replace(nextUrl, { scroll: false });
  }, [pathname, router, searchParams]);

  return product ? <ProductCustomizationModal product={product} onClose={close} /> : null;
}
