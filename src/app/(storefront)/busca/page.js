import Link from "next/link";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { Container } from "@/components/ui/Container";
import { SearchInput } from "@/components/ui/SearchInput";
import { getCatalogRepository } from "@/repositories/catalog";
import styles from "../storefront.module.css";

export const metadata = { title: "Buscar no cardápio", description: "Busque por produtos, ingredientes, categorias e tags." };

export default async function SearchPage({ searchParams }) {
  const { q = "" } = await searchParams;
  const repository = getCatalogRepository();
  const [results, suggestions] = await Promise.all([q ? repository.searchProducts(q) : Promise.resolve([]), repository.getProducts()]);
  return <Container className={styles.section}>
    <nav className={styles.breadcrumb} aria-label="Breadcrumb"><Link href="/">Início</Link><span aria-hidden="true">/</span><span aria-current="page">Busca</span></nav>
    <header className={`${styles.pageHeader} ${styles.searchHeader}`}><div><h1>{q ? `Resultados para “${q}”` : "O que você deseja hoje?"}</h1><p>Busque por nome, descrição, categoria ou ingrediente.</p></div><SearchInput initialValue={q} suggestions={suggestions} /></header>
    {q && <p aria-live="polite">{results.length} {results.length === 1 ? "resultado encontrado" : "resultados encontrados"}</p>}
    <ProductGrid products={results} emptyTitle={q ? "Nenhum sabor encontrado" : "Digite um termo para começar"} emptyDescription={q ? "Tente um nome mais curto, ingrediente ou categoria diferente." : "Experimente buscar por pizza, chocolate, vegetariana ou combo."} />
  </Container>;
}
