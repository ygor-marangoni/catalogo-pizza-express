import { SearchCheck } from "lucide-react";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { StoreHero } from "@/components/storefront/StoreHero";
import { Container } from "@/components/ui/Container";
import { SearchInput } from "@/components/ui/SearchInput";
import { getCatalogRepository } from "@/repositories/catalog";
import styles from "./search.module.css";

export const metadata = { title: "Buscar no cardápio", description: "Busque por produtos, ingredientes, categorias e tags." };

export default async function SearchPage({ searchParams }) {
  const { q = "" } = await searchParams;
  const repository = getCatalogRepository();
  const [store, results, suggestions] = await Promise.all([
    repository.getStore(),
    q ? repository.searchProducts(q) : Promise.resolve([]),
    repository.getProducts(),
  ]);
  const resultLabel = `${results.length} ${results.length === 1 ? "resultado encontrado" : "resultados encontrados"}`;

  return <>
    <StoreHero
      store={store}
      title="Busca"
      description={q ? `Sabores e produtos relacionados a “${q}”.` : "Encontre pizzas, bebidas, doces, combos e adicionais do seu jeito."}
      titleId="search-hero-title"
    />

    <Container className={styles.searchPage}>
      <section className={styles.searchPanel} aria-labelledby="search-panel-title">
        <div className={styles.searchPanelCopy}>
          <span className={styles.eyebrow}>Encontre seu sabor</span>
          <h2 id="search-panel-title">{q ? `Resultados para “${q}”` : "O que você deseja hoje?"}</h2>
          <p>Busque por nome, descrição, categoria, ingrediente ou característica.</p>
        </div>
        <div className={styles.searchField}><SearchInput initialValue={q} suggestions={suggestions} /></div>
      </section>

      {q && <div className={styles.resultsHeader} aria-live="polite">
        <div>
          <span className={styles.resultsIcon} aria-hidden="true"><SearchCheck size={20} /></span>
          <div><small>Cardápio Pizza Express</small><strong>{resultLabel}</strong></div>
        </div>
      </div>}

      <section className={styles.results} aria-label={q ? resultLabel : "Resultados da busca"}>
        <ProductGrid products={results} emptyTitle={q ? "Nenhum sabor encontrado" : "Digite um termo para começar"} emptyDescription={q ? "Tente um nome mais curto, ingrediente ou categoria diferente." : "Experimente buscar por pizza, chocolate, vegetariana ou combo."} />
      </section>
    </Container>
  </>;
}
