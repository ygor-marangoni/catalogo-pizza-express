"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CircleAlert, CircleDot, ExternalLink, Layers3, Package,
  Plus, Ruler, Settings2, Star, Store, Tags,
} from "lucide-react";
import { productsApi } from "@/features/admin-catalog/products-api";
import { categoriesApi } from "@/features/admin-catalog/categories-api";
import { sizesApi } from "@/features/admin-catalog/sizes-api";
import { edgesApi } from "@/features/admin-catalog/edges-api";
import { additionalsApi } from "@/features/admin-catalog/additionals-api";
import { storeApi } from "@/features/admin-catalog/store-api";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminLoader } from "@/components/admin/AdminLoader";
import { AvailabilityChart, CategoryChart } from "@/components/admin/CatalogCharts";
import styles from "@/app/admin.module.css";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  async function load() {
    setError("");
    try {
      const [products, categories, sizes, edges, additionals, status] = await Promise.all([
        productsApi.list(), categoriesApi.list(), sizesApi.list(),
        edgesApi.list(), additionalsApi.list(), storeApi.getStatus(),
      ]);
      setData({ products, categories, sizes, edges, additionals, status });
    } catch (loadError) {
      setError(loadError.message);
    }
  }

  useEffect(() => {
    let active = true;
    Promise.all([
      productsApi.list(), categoriesApi.list(), sizesApi.list(),
      edgesApi.list(), additionalsApi.list(), storeApi.getStatus(),
    ]).then(([products, categories, sizes, edges, additionals, status]) => {
      if (active) setData({ products, categories, sizes, edges, additionals, status });
    }).catch((loadError) => { if (active) setError(loadError.message); });
    return () => { active = false; };
  }, []);

  if (error) {
    return <div role="alert">
      <AdminPageHeader eyebrow="Painel administrativo" title="Dashboard" description="Não foi possível carregar os indicadores." />
      <section className={styles.panel}><div className={styles.panelBody}><p className={styles.error}>{error}</p><button className={styles.button} onClick={load}>Tentar novamente</button></div></section>
    </div>;
  }
  if (!data) return <AdminLoader fullScreen label="Carregando indicadores..." />;

  const unavailable = data.products.filter((product) => !product.available);
  const highlighted = data.products.filter((product) => product.highlighted);
  const availableCount = data.products.length - unavailable.length;
  const categoryDistribution = data.categories.map((category) => ({
    ...category,
    total: data.products.filter((product) => product.category_id === category.id).length,
  })).sort((a, b) => b.total - a.total);
  const metrics = [
    { label: "Total de produtos", value: data.products.length, detail: "cadastrados", icon: Package },
    { label: "Categorias", value: data.categories.length, detail: "organizando o cardápio", icon: Tags },
    { label: "Tamanhos", value: data.sizes.length, detail: "opções globais", icon: Ruler },
    { label: "Bordas", value: data.edges.length, detail: "opções globais", icon: CircleDot },
    { label: "Adicionais", value: data.additionals.length, detail: "complementos disponíveis", icon: Layers3 },
    { label: "Em destaque", value: highlighted.length, detail: "priorizados no cardápio", icon: Star },
  ];

  async function toggleStore() {
    await storeApi.updateStatus(!data.status.is_open);
    await load();
  }

  return <>
    <AdminPageHeader eyebrow="Painel administrativo" title="Dashboard" description="Resumo operacional do cardápio digital da Pizza Express." />

    <section className={styles.metrics} aria-label="Indicadores do catálogo">
      {metrics.map(({ label, value, detail, icon: Icon }) => <article className={styles.card} key={label}>
        <span className={styles.metricIcon}><Icon size={22} /></span>
        <span className={styles.metricCopy}><span className={styles.metricLabel}>{label}</span><span><strong className={styles.metricValue}>{value}</strong> <span className={styles.metricDetail}>{detail}</span></span></span>
      </article>)}
    </section>

    <section className={styles.statusHero}>
      <div className={styles.statusHeroMain}>
        <span className={`${styles.statusHeroIcon} ${!data.status.is_open ? styles.closed : ""}`}><Store size={24} /></span>
        <div><span className={styles.metricLabel}>Status público</span><h2>Loja {data.status.is_open ? "aberta" : "fechada"}</h2><p>Este estado é exibido imediatamente no topo do cardápio.</p></div>
      </div>
      <button className={data.status.is_open ? `${styles.button} ${styles.secondary}` : styles.button} onClick={toggleStore}>
        {data.status.is_open ? "Fechar loja" : "Abrir loja"}
      </button>
    </section>

    <div className={styles.chartsGrid}>
      <section className={styles.panel}>
        <header className={styles.panelHeader}><div><h2>Disponibilidade do catálogo</h2><p>Proporção entre produtos disponíveis e indisponíveis.</p></div></header>
        <div className={styles.chartBody}><AvailabilityChart available={availableCount} unavailable={unavailable.length} /></div>
      </section>
      <section className={styles.panel}>
        <header className={styles.panelHeader}><div><h2>Produtos por categoria</h2><p>Distribuição atual dos itens do cardápio.</p></div></header>
        <div className={styles.barChart}><CategoryChart categories={categoryDistribution.slice(0, 6)} /></div>
      </section>
    </div>

    <div className={styles.dashboardColumns}>
      <section className={styles.panel}>
        <header className={styles.panelHeader}><div><h2>Alertas importantes</h2><p>Pontos que precisam de atenção no catálogo.</p></div></header>
        <div className={styles.panelBody}>
          {unavailable.length === 0 ? <p className={styles.empty}>Tudo certo: não há produtos indisponíveis.</p> :
            <div className={styles.alertList}>{unavailable.slice(0, 4).map((product) => <div className={styles.alertItem} key={product.id}>
              <span className={styles.alertIcon}><CircleAlert size={21} strokeWidth={2.2} /></span>
              <div className={styles.alertItemMain}><strong>{product.name}</strong><span>Produto fora do cardápio público</span></div>
              <Link className={`${styles.button} ${styles.secondary}`} href={`/admin/produtos/${product.id}`}>Editar</Link>
            </div>)}</div>}
        </div>
      </section>

      <section className={styles.panel}>
        <header className={styles.panelHeader}><div><h2>Ações rápidas</h2><p>Atalhos para as tarefas mais frequentes.</p></div></header>
        <div className={styles.panelBody}><div className={styles.quickGrid}>
          <Link className={styles.quickAction} href="/admin/produtos/novo"><Plus size={20} /><span><strong>Novo produto</strong><small>Adicionar ao cardápio</small></span></Link>
          <Link className={styles.quickAction} href="/admin/categorias"><Tags size={20} /><span><strong>Nova categoria</strong><small>Organizar produtos</small></span></Link>
          <Link className={styles.quickAction} href="/admin/loja"><Settings2 size={20} /><span><strong>Configurar loja</strong><small>Dados e horários</small></span></Link>
          <Link className={styles.quickAction} href="/" target="_blank"><ExternalLink size={20} /><span><strong>Ver cardápio</strong><small>Abrir área pública</small></span></Link>
        </div></div>
      </section>
    </div>
  </>;
}
