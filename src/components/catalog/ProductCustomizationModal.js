"use client";

import Image from "next/image";
import { Clock3, X } from "lucide-react";
import { useOverlay } from "@/hooks/useOverlay";
import { Badge } from "@/components/ui/Badge";
import { IconButton } from "@/components/ui/IconButton";
import { Price } from "@/components/ui/Price";
import { getStartingPrice } from "@/features/catalog/catalog-domain";
import { ProductConfigurator } from "./ProductConfigurator";
import styles from "./ProductCustomizationModal.module.css";

export function ProductCustomizationModal({ product, editingItem, onClose, onComplete }) {
  const open = Boolean(product);
  const panelRef = useOverlay(open, onClose);
  if (!product) return null;
  const startingPrice = getStartingPrice(product);

  return <div className={styles.overlay} role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
    <section ref={panelRef} tabIndex={-1} className={styles.dialog} role="dialog" aria-modal="true" aria-labelledby="product-modal-title">
      <header className={styles.header}>
        <h2 id="product-modal-title">Escolha do seu jeito</h2>
        <IconButton className={styles.closeButton} label="Fechar personalização" onClick={onClose}><X size={22} /></IconButton>
      </header>
      <div className={styles.body}>
        <div className={styles.visual}>
          <div className={styles.image}><Image src={product.images[0]} alt={`Imagem de ${product.name}`} fill sizes="(max-width: 760px) 100vw, 440px" preload /></div>
          <div className={styles.visualCopy}>
            <div className={styles.badges}>{product.compareAtPriceInCents > startingPrice && <Badge tone="success">Oferta</Badge>} {!product.available && <Badge tone="danger">Indisponível</Badge>}</div>
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <div className={styles.meta}><Price className={styles.neutralPrice} value={startingPrice} compareAt={product.compareAtPriceInCents} prefix={product.variants?.length ? "a partir de" : undefined} /><span className={styles.prep}><Clock3 size={16} />{product.preparationTime}</span></div>
          </div>
        </div>
        <div className={styles.content}><ProductConfigurator key={editingItem?.id || product.id} product={product} editingItem={editingItem} inModal onComplete={onComplete} /></div>
      </div>
    </section>
  </div>;
}
