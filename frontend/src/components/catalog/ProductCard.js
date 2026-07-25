"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Price } from "@/components/ui/Price";
import { getStartingPrice } from "@/features/catalog/catalog-domain";
import styles from "./catalog.module.css";

export function ProductCard({ product }) {
  const price = getStartingPrice(product);
  const pathname = usePathname();
  const router = useRouter();

  function openProduct() {
    const params = new URLSearchParams(window.location.search);
    params.set("produto", product.slug);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return <Card className={styles.productCard}>
      <button className={styles.cardTrigger} type="button" onClick={openProduct} aria-label={`Personalizar ${product.name}`} />
      <div className={styles.productCopy}>
        <h3>{product.name}</h3>
        <p>{product.shortDescription}</p>
        <div className={styles.productMeta}><Price className={styles.productPrice} value={price} compareAt={product.compareAtPriceInCents} prefix={product.variants?.length ? "a partir de" : undefined} /></div>
      </div>
      <div className={styles.productImage}>
        <div className={styles.badges}>
          {product.compareAtPriceInCents > price && <Badge tone="success">Oferta</Badge>}
          {!product.available && <Badge tone="danger">Indisponível</Badge>}
        </div>
        <Image src={product.images[0]} alt={`Apresentação de ${product.name}`} fill sizes="(max-width: 780px) 96px, 172px" />
      </div>
    </Card>
  ;
}
