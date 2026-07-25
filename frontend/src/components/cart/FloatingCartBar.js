"use client";

import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";
import shoppingBagIcon from "../../../assets/icons/shopping-bag.webp";
import { useCart } from "@/contexts/CartContext";
import { formatCurrency } from "@/lib/currency";
import { Container } from "@/components/ui/Container";
import styles from "./floating-cart.module.css";

export function FloatingCartBar({ onOpen }) {
  const pathname = usePathname();
  const { hydrated, itemCount, subtotalInCents } = useCart();

  if (!hydrated || itemCount === 0 || pathname === "/carrinho") return null;

  const itemLabel = `${itemCount} ${itemCount === 1 ? "item" : "itens"}`;

  return <aside className={styles.bar} aria-label="Resumo do carrinho">
    <Container className={styles.inner}>
      <div className={styles.summary}>
        <span className={styles.bagIcon} aria-hidden="true">
          <Image src={shoppingBagIcon} alt="" width={25} height={25} />
          <small>{itemCount}</small>
        </span>
        <span className={styles.copy}>
          <small className={styles.desktopLabel}>{itemLabel} no pedido</small>
          <small className={styles.mobileLabel}>Total sem a entrega</small>
          <strong>{formatCurrency(subtotalInCents)} <em>/ {itemLabel}</em></strong>
        </span>
      </div>
      <button className={styles.action} type="button" onClick={onOpen} aria-label={`Abrir carrinho com ${itemLabel}`}>
        <Image src={shoppingBagIcon} alt="" width={19} height={19} />
        <span>Ver carrinho</span>
        <ChevronRight size={22} aria-hidden="true" />
      </button>
    </Container>
  </aside>;
}
