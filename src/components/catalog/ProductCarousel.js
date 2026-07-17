"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { IconButton } from "@/components/ui/IconButton";
import { ProductCard } from "./ProductCard";
import styles from "./catalog.module.css";

export function ProductCarousel({ products, label }) {
  const railRef = useRef(null);
  const [canScrollPrevious, setCanScrollPrevious] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return undefined;

    function updateControls() {
      const maxScroll = Math.max(0, rail.scrollWidth - rail.clientWidth);
      const edgeTolerance = 12;
      setCanScrollPrevious(rail.scrollLeft > edgeTolerance);
      setCanScrollNext(rail.scrollLeft < maxScroll - edgeTolerance);
    }

    updateControls();
    rail.addEventListener("scroll", updateControls, { passive: true });
    const observer = new ResizeObserver(updateControls);
    observer.observe(rail);

    return () => {
      rail.removeEventListener("scroll", updateControls);
      observer.disconnect();
    };
  }, [products]);

  function scroll(direction) {
    railRef.current?.scrollBy({ left: direction * Math.min(660, railRef.current.clientWidth * 0.85), behavior: "smooth" });
  }

  return <div className={styles.carousel}>
    <div className={styles.carouselControls} aria-label={`Controles de ${label}`}>
      <IconButton className={styles.carouselPrevious} label="Produtos anteriores" disabled={!canScrollPrevious} onClick={() => scroll(-1)}><ArrowLeft size={20} strokeWidth={2.2} /></IconButton>
      <IconButton className={styles.carouselNext} label="Próximos produtos" disabled={!canScrollNext} onClick={() => scroll(1)}><ArrowRight size={20} strokeWidth={2.2} /></IconButton>
    </div>
    <div className={styles.productRail} ref={railRef} aria-label={`${label}: produtos`}>{products.map((product) => <ProductCard product={product} key={product.id} />)}</div>
  </div>;
}
