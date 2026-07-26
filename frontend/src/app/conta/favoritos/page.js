"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Heart, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import fallbackProduct from "../../../../assets/images/produto-exemplo.webp";
import { Price } from "@/components/ui/Price";
import { useCustomerAuth } from "@/contexts/CustomerAuthContext";
import { catalogService } from "@/services/catalog-service";
import { customerService } from "@/services/customer-service";
import styles from "../account.module.css";

function getOrderedProducts(orders, products) {
  const productsById = new Map(products.map((product) => [String(product.id), product]));
  const seen = new Set();
  return orders.flatMap((order) => (order.items || []).map((item) => {
    const productId = String(item.product_id);
    if (seen.has(productId)) return null;
    const product = productsById.get(productId);
    if (!product) return null;
    seen.add(productId);
    return { product, orderId: order.id };
  })).filter(Boolean);
}

export default function FavoritesPage() {
  const { account, loading } = useCustomerAuth();
  const [items, setItems] = useState([]);
  const [itemsLoading, setItemsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!account) return undefined;
    let active = true;
    Promise.all([customerService.getOrders(), catalogService.getProducts()])
      .then(([orders, products]) => { if (active) setItems(getOrderedProducts(orders, products)); })
      .catch((exception) => { if (active) setError(exception.message); })
      .finally(() => { if (active) setItemsLoading(false); });
    return () => { active = false; };
  }, [account]);

  if (loading) return <main className={styles.page}><section className={styles.loadingState}><span className={styles.loadingSpinner} /><p>Carregando seus pedidos...</p></section></main>;
  if (!account) return <main className={styles.page}><section className={styles.emptyState}><p>Entre para ver as pizzas que você já pediu.</p><Link className={styles.primary} href="/login?next=/conta/favoritos">Entrar</Link></section></main>;

  return <main className={styles.page}>
    <div className={`${styles.toolbar} ${styles.favoriteToolbar}`}>
      <div>
        <Link className={styles.backLink} href="/conta"><ArrowLeft size={16} />Minha conta</Link>
        <p className={styles.eyebrow}>Seu histórico</p>
        <h1>Pizzas que você já pediu</h1>
      </div>
      <div className={styles.favoriteHeaderMeta} aria-label={`${items.length} pizzas pedidas`}><Heart size={17} /><strong>{items.length}</strong><span>pizzas pedidas</span></div>
    </div>

    {error && <p className={styles.error} role="alert">{error}</p>}
    {itemsLoading ? <section className={styles.loadingState}><span className={styles.loadingSpinner} /><p>Buscando seu histórico...</p></section> : !items.length && !error ? <section className={styles.emptyState}>
      <div className={styles.emptyIcon}><ShoppingBag size={26} /></div>
      <h2>Ainda não há pizzas aqui</h2>
      <p>Quando você fizer um pedido, suas escolhas aparecerão nesta página.</p>
      <Link className={styles.primary} href="/"><ShoppingBag size={16} />Explorar cardápio</Link>
    </section> : <section className={styles.favoriteGrid} aria-label="Pizzas já pedidas">
      {items.map(({ product, orderId }) => {
        const image = product.images?.[0] || fallbackProduct;
        return <article className={styles.favoriteCard} key={`${product.id}-${orderId}`}>
          <div className={styles.favoriteImage}>
            <Image src={image} alt={`Pizza ${product.name}`} fill sizes="(max-width: 560px) 94vw, (max-width: 900px) 46vw, 370px" unoptimized={typeof image === "string"} />
            <span className={styles.favoriteBadge} aria-hidden="true"><Heart size={16} /></span>
          </div>
          <div className={styles.favoriteBody}>
            <h2>{product.name}</h2>
            <p>{product.shortDescription || product.description || "Uma escolha especial da Pizza Express."}</p>
            <Price className={styles.favoritePrice} value={product.basePriceInCents} />
            <div className={styles.favoriteActions}><Link className={styles.primary} href={`/?produto=${product.slug}`}><ShoppingBag size={15} />Pedir novamente</Link></div>
          </div>
        </article>;
      })}
    </section>}
  </main>;
}
