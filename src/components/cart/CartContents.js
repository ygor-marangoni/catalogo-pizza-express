"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowRight, PencilLine, Trash2, X } from "lucide-react";
import shoppingBagIcon from "../../../assets/icons/shopping-bag.webp";
import { useCart } from "@/contexts/CartContext";
import { calculateItemTotal } from "@/features/cart/cart-domain";
import { Button } from "@/components/ui/Button";
import { Price } from "@/components/ui/Price";
import { QuantitySelector } from "@/components/ui/QuantitySelector";
import { Skeleton } from "@/components/ui/Skeleton";
import styles from "./cart.module.css";

export function CartContents({ page = false, onNavigate }) {
  const pathname = usePathname();
  const router = useRouter();
  const { cart, hydrated, subtotalInCents, updateQuantity, removeItem, clearCart, startEditing } = useCart();

  function editItem(item) {
    const params = new URLSearchParams(window.location.search);
    params.set("produto", item.productSlug);
    startEditing(item.id);
    onNavigate?.();
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  function getItemConfiguration(item) {
    const groupedAddons = (item.addons || []).reduce((groups, addon) => {
      const existing = groups.get(addon.groupName) || [];
      groups.set(addon.groupName, [...existing, addon.name]);
      return groups;
    }, new Map());

    return [
      ...(item.variant ? [{ label: "Tamanho", value: item.variant.name }] : []),
      ...[...groupedAddons].map(([label, values]) => ({ label: label.replace(/^Escolha (a|o|as|os)\s+/i, ""), value: values.join(", ") })),
      ...(item.note ? [{ label: "Observação", value: item.note }] : []),
    ];
  }
  if (!hydrated) return <div className={styles.skeletons} aria-label="Carregando carrinho"><Skeleton height="90px" /><Skeleton height="90px" /></div>;
  if (!cart.items.length) return <div className={`${styles.empty} ${page ? "" : styles.emptyDrawer}`.trim()}>
    <section className={styles.emptyState} aria-labelledby="empty-cart-title">
      <div className={styles.emptyIcon} aria-hidden="true">
        <Image src={shoppingBagIcon} alt="" width={29} height={29} />
      </div>
      <h2 id="empty-cart-title">Seu carrinho está vazio</h2>
      <p className={styles.emptyDescription}>Escolha suas pizzas favoritas, personalize cada detalhe e volte quando estiver pronto.</p>
      <Link className={styles.emptyAction} href="/" onClick={onNavigate}>
        <span>Explorar cardápio</span>
        <ArrowRight size={18} aria-hidden="true" />
      </Link>
    </section>
  </div>;

  const items = <>
    <div className={styles.items}>{cart.items.map((item) => {
      const configuration = getItemConfiguration(item);
      return <article className={styles.item} key={item.id}>
      <div className={styles.image}><Image src={item.image} alt="" fill sizes="76px" /></div>
      <div className={styles.details}>
        <div className={styles.itemTitleRow}><h3>{item.name}</h3><div className={styles.itemPrice}><Price className={styles.neutralPrice} value={calculateItemTotal(item)} /></div></div>
        {configuration.length > 0 && <ul className={styles.configuration}>{configuration.map((detail) => <li key={detail.label}><strong>{detail.label}:</strong> <span>{detail.value}</span></li>)}</ul>}
        <button type="button" className={styles.editAction} onClick={() => editItem(item)}><PencilLine size={14} aria-hidden="true" /><span>Editar escolhas</span></button>
      </div>
      <div className={styles.itemActions}>
        <QuantitySelector label={`Quantidade de ${item.name}`} value={item.quantity} onChange={(quantity) => updateQuantity(item.id, quantity)} />
        <div className={styles.itemActionButtons}>
          <button type="button" className={styles.removeAction} onClick={() => removeItem(item.id)} aria-label={`Remover ${item.name}`}><X size={16} aria-hidden="true" /><span>Remover</span></button>
        </div>
      </div>
    </article>})}</div>
    <div className={styles.clearRow}><button className={styles.clearAction} type="button" onClick={clearCart}><Trash2 size={15} aria-hidden="true" /><span>Limpar carrinho</span></button></div>
  </>;

  const summary = <div className={styles.summary}>
    <div className={styles.summaryRow}><strong>Subtotal</strong><Price className={styles.neutralPrice} value={subtotalInCents} /></div>
    <p className={styles.future}>Frete, cupom, identificação e confirmação do pedido estarão disponíveis em uma próxima etapa.</p>
    <Button block disabled title="Disponível em uma próxima etapa">Continuar para identificação | em breve</Button>
  </div>;

  if (page) return <div className={styles.pageLayout}><section className={styles.pageItems} aria-label="Itens do carrinho">{items}</section><aside className={styles.pageSummary} aria-label="Resumo do carrinho">{summary}</aside></div>;
  return <div className={styles.body}>{items}{summary}</div>;
}
