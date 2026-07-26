"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CircleCheck, CircleDot, FilterX, Pencil, Plus, Search, Star, Tags, Trash2 } from "lucide-react";
import { productsApi } from "@/features/admin-catalog/products-api";
import { categoriesApi } from "@/features/admin-catalog/categories-api";
import { formatCurrency } from "@/lib/currency";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminSelect } from "@/components/admin/AdminSelect";
import { AdminPagination } from "@/components/admin/AdminPagination";
import { useToast } from "@/components/ui/Toast";
import fallbackProduct from "../../../../../assets/images/produto-exemplo.webp";
import styles from "@/app/admin.module.css";

const PAGE_SIZE = 10;

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [availability, setAvailability] = useState("");
  const [featured, setFeatured] = useState("");
  const [page, setPage] = useState(1);
  const [message, setMessage] = useState("");
  const { notify } = useToast();

  async function load() {
    try {
      const [productRecords, categoryRecords] = await Promise.all([productsApi.list(), categoriesApi.list()]);
      setProducts(productRecords); setCategories(categoryRecords);
    } catch (error) { setMessage(error.message); }
  }
  useEffect(() => {
    let active = true;
    Promise.all([productsApi.list(), categoriesApi.list()])
      .then(([productRecords, categoryRecords]) => {
        if (active) { setProducts(productRecords); setCategories(categoryRecords); }
      }).catch((error) => { if (active) setMessage(error.message); });
    return () => { active = false; };
  }, []);

  const filtered = useMemo(() => products.filter((product) =>
    (!query || product.name.toLowerCase().includes(query.toLowerCase())) &&
    (!category || String(product.category_id) === category) &&
    (!availability || String(product.available) === availability) &&
    (!featured || String(product.highlighted) === featured)
  ), [products, query, category, availability, featured]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visibleProducts = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  async function patch(product, values) {
    try { await productsApi.update(product.id, values); notify("Produto atualizado com sucesso."); await load(); }
    catch (error) { setMessage(error.message); }
  }
  async function remove(product) {
    if (!confirm(`Excluir “${product.name}”?`)) return;
    try { await productsApi.remove(product.id); setMessage(""); notify("Produto excluído com sucesso."); await load(); }
    catch (error) { setMessage(error.message); }
  }

  return <>
    <AdminPageHeader eyebrow="Gerenciamento" title="Produtos" description="Listagem e controle dos itens exibidos no cardápio."
      action={<Link className={styles.button} href="/admin/produtos/novo"><Plus size={17} strokeWidth={2.5} />Novo produto</Link>} />
    {message && <p className={styles.message} role="status">{message}</p>}
    <section className={styles.panel}>
      <header className={styles.panelHeader}><div><h2>Catálogo de produtos</h2><p>Controle preço, disponibilidade e destaque.</p></div><div className={styles.catalogSummary}><span><CircleCheck size={17} /> <strong>{products.filter((product) => product.available).length}</strong> disponíveis</span><span><Star size={17} /> <strong>{products.filter((product) => product.highlighted).length}</strong> destaques</span></div></header>
      <div className={`${styles.panelBody} ${styles.productsPanelBody}`}>
        <div className={styles.filterBar}>
          <label className={styles.filterControl}><span>Pesquisar</span><Search size={18} /><input aria-label="Pesquisar" placeholder="Buscar produto…" value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} /></label>
          <AdminSelect label="Categoria" value={category} onChange={(value) => { setCategory(value); setPage(1); }} icon={Tags} options={[{ value: "", label: "Todas as categorias" }, ...categories.map((item) => ({ value: String(item.id), label: item.name }))]} />
          <AdminSelect label="Disponibilidade" value={availability} onChange={(value) => { setAvailability(value); setPage(1); }} icon={CircleDot} options={[{ value: "", label: "Todas as disponibilidades" }, { value: "true", label: "Disponíveis" }, { value: "false", label: "Indisponíveis" }]} />
          <AdminSelect label="Destaque" value={featured} onChange={(value) => { setFeatured(value); setPage(1); }} icon={Star} options={[{ value: "", label: "Todos os destaques" }, { value: "true", label: "Em destaque" }, { value: "false", label: "Sem destaque" }]} />
          <button className={styles.clearFilters} type="button" onClick={() => { setQuery(""); setCategory(""); setAvailability(""); setFeatured(""); setPage(1); }}><FilterX size={17} />Limpar</button>
        </div>
        {filtered.length === 0 ? <p className={styles.empty}>Nenhum produto encontrado.</p> :
          <div className={`${styles.tableWrap} ${styles.stickyTable}`}><table className={styles.table}><thead><tr><th>Produto</th><th>Categoria</th><th>Preço</th><th>Disponível</th><th>Destaque</th><th>Ações</th></tr></thead>
            <tbody>{visibleProducts.map((product) => <tr key={product.id}>
              <td data-label="Produto"><div className={styles.productCell}><span className={styles.productImage} style={{ backgroundImage: `url("${product.image_url || fallbackProduct.src}")` }} /><span><strong>{product.name}</strong><small>#{product.id}</small></span></div></td>
              <td data-label="Categoria">{categories.find((item) => item.id === product.category_id)?.name || "—"}</td>
              <td data-label="Preço"><strong>{formatCurrency(product.base_price)}</strong></td>
              <td data-label="Disponível"><button className={`${styles.badge} ${!product.available ? styles.badgeOff : ""}`} onClick={() => patch(product, { available: String(!product.available) })}>{product.available ? "Sim" : "Não"}</button></td>
              <td data-label="Destaque"><button className={`${styles.badge} ${product.highlighted ? styles.badgeDark : styles.badgeOff}`} onClick={() => patch(product, { highlighted: String(!product.highlighted) })}>{product.highlighted ? "Sim" : "Não"}</button></td>
              <td data-label="Ações"><div className={styles.actions}><Link className={styles.iconButton} href={`/admin/produtos/${product.id}`} aria-label={`Editar ${product.name}`}><Pencil size={17} /></Link><button className={`${styles.iconButton} ${styles.danger}`} onClick={() => remove(product)} aria-label={`Excluir ${product.name}`}><Trash2 size={17} /></button></div></td>
            </tr>)}</tbody></table></div>}
        <AdminPagination page={currentPage} pageSize={PAGE_SIZE} total={filtered.length} onPageChange={setPage} />
      </div>
    </section>
  </>;
}
