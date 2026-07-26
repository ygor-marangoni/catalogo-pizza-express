"use client";

import Link from "next/link";
import { ArrowLeft, Heart, ShoppingBag, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Price } from "@/components/ui/Price";
import { useCustomerAuth } from "@/contexts/CustomerAuthContext";
import { catalogService } from "@/services/catalog-service";
import { customerService } from "@/services/customer-service";
import styles from "../account.module.css";

export default function FavoritesPage() {
  const { account, loading } = useCustomerAuth();
  const [items, setItems] = useState([]);
  const [itemsLoading, setItemsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!account) return undefined;
    let active = true;
    Promise.resolve().then(() => customerService.getFavorites()).then((favorites) => Promise.all(favorites.map(async (favorite) => ({ favorite, product: await catalogService.getProductById(favorite.product_id) })))).then((products) => { if (active) setItems(products.filter((item) => item.product)); }).catch((exception) => { if (active) setError(exception.message); }).finally(() => { if (active) setItemsLoading(false); });
    return () => { active = false; };
  }, [account]);

  if (loading) return <main className={styles.page}><div className={styles.panel}>Carregando seus favoritos…</div></main>;
  if (!account) return <main className={styles.page}><section className={styles.panel}><p>Entre para acessar seus favoritos.</p><Link className={styles.primary} href="/conta/login?next=/conta/favoritos">Entrar</Link></section></main>;

  return <main className={styles.page}>
    <div className={styles.toolbar}><div><Link className={styles.backLink} href="/conta"><ArrowLeft size={16} />Minha conta</Link><h1>Favoritos</h1><p>Suas escolhas favoritas, sempre por perto.</p></div></div>
    {error && <p className={styles.error}>{error}</p>}
    {itemsLoading ? <section className={styles.panel}>Buscando seus favoritos…</section> : !items.length && !error ? <section className={styles.emptyState}><div className={styles.emptyIcon}><Heart size={25} /></div><h2>Seu mural está esperando</h2><p>Salve os produtos que você mais gosta para encontrá-los em segundos.</p><Link className={styles.primary} href="/"><ShoppingBag size={16} />Explorar cardápio</Link></section> : <section className={styles.favoriteGrid} aria-label="Produtos favoritos">
      {items.map(({ favorite, product }) => <article className={styles.favoriteCard} key={favorite.id}><div className={styles.favoriteBody}><h2>{product.name}</h2><p>{product.shortDescription || product.description}</p><Price className={styles.favoritePrice} value={product.basePriceInCents} /><div className={styles.favoriteActions}><Link className={styles.secondary} href={`/?produto=${product.slug}`}>Ver produto</Link><button className={styles.secondary} type="button" onClick={async () => { await customerService.removeFavorite(favorite.id); setItems((current) => current.filter((item) => item.favorite.id !== favorite.id)); }}><Trash2 size={14} />Remover</button></div></div></article>)}
    </section>}
  </main>;
}
