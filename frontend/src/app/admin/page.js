"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { catalogService } from "@/services/catalog-service";
import styles from "./admin.module.css";

export default function AdminHome() {
  const { account, loading } = useAuth(); const [data, setData] = useState(null); const [error, setError] = useState("");
  useEffect(() => { if (!loading && account) Promise.all([catalogService.getStore(), catalogService.getCategories(), catalogService.getProducts()]).then(([store, categories, products]) => setData({ store, categories, products })).catch((exception) => setError(exception.message)); }, [account, loading]);
  if (!account) return <section className={styles.panel}><h1>Painel administrativo</h1><p>Entre para gerenciar a loja.</p><Link className={styles.primary} href="/login?next=/admin">Ir para o login</Link></section>;
  if (error) return <section className={styles.panel}><h1>Não foi possível carregar o painel</h1><p>{error}</p></section>;
  if (!data) return <p>Carregando dados…</p>;
  return <><div className={styles.toolbar}><div><h1>Visão geral</h1><p>Olá, {account.name}.</p></div><strong>{data.store.is_open ? "Loja aberta" : "Loja fechada"}</strong></div><div className={styles.grid}><div className={styles.panel}><small>Produtos</small><h2>{data.products.length}</h2><Link href="/admin/products">Gerenciar</Link></div><div className={styles.panel}><small>Categorias</small><h2>{data.categories.length}</h2><Link href="/admin/categories">Gerenciar</Link></div><div className={styles.panel}><small>Indisponíveis</small><h2>{data.products.filter((product) => !product.available).length}</h2></div></div></>;
}

