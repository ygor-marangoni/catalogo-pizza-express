"use client";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { catalogService } from "@/services/catalog-service";
import { useAdminResourceList } from "@/hooks/useAdminResourceList";
import styles from "../admin.module.css";

export default function CategoriesPage() {
  const fetchPage = useCallback((page) => catalogService.getCategoriesPage({ page, limit: 12 }), []);
  const deleteResource = useCallback((id) => catalogService.deleteCategory(id), []);
  const { items, page, total, loading, error, load, remove } = useAdminResourceList(fetchPage, deleteResource);
  const [confirmingId, setConfirmingId] = useState(null);
  const sentinelRef = useRef(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || loading || items.length >= total || !total) return undefined;
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) load(page + 1, false); }, { rootMargin: "320px" });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [items.length, load, loading, page, total]);

  async function confirmRemove(id) { await remove(id); setConfirmingId(null); }

  return <>
    <div className={styles.toolbar}><div><h1>Categorias</h1><p>{total} categorias cadastradas.</p></div><Link className={styles.primary} href="/admin/categories/new">+ Nova categoria</Link></div>
    {error && <p className={styles.error} role="alert">{error}</p>}
    <section className={`${styles.panel} ${styles.listPanel}`} aria-busy={loading}>
      <div className={styles.cardGrid}>{items.map((item) => <article className={styles.resourceCard} key={item.id}><div className={styles.resourceCardHeader}><span className={styles.cardIcon}>C</span><span className={styles.status}>Ativa</span></div><h2>{item.name}</h2><p>{item.description || "Sem descrição cadastrada."}</p><div className={styles.cardActions}><Link className={styles.cardButton} href={`/admin/categories/${item.id}/edit`}>Editar</Link>{confirmingId === item.id ? <><button className={styles.danger} onClick={() => confirmRemove(item.id)}>Confirmar exclusão</button><button onClick={() => setConfirmingId(null)}>Cancelar</button></> : <button className={styles.danger} onClick={() => setConfirmingId(item.id)}>Excluir</button>}</div></article>)}</div>
      {!items.length && !loading && <p className={styles.empty}>Nenhuma categoria cadastrada.</p>}
      <div ref={sentinelRef} className={styles.loadMore}>{loading ? "Carregando categorias…" : items.length >= total && total ? "Todas as categorias foram carregadas." : ""}</div>
    </section>
  </>;
}
