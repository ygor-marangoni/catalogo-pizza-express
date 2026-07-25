import { notFound } from "next/navigation";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { StoreHero } from "@/components/storefront/StoreHero";
import { Container } from "@/components/ui/Container";
import { getCatalogRepository } from "@/repositories/catalog";
import styles from "../../storefront.module.css";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const category = await getCatalogRepository().getCategoryBySlug(slug);
  return category ? { title: category.name, description: category.description } : { title: "Categoria não encontrada" };
}

export default async function CategoryPage({ params }) {
  const { slug } = await params;
  const repository = getCatalogRepository();
  const [store, category] = await Promise.all([
    repository.getStore(),
    repository.getCategoryBySlug(slug),
  ]);
  if (!category) notFound();
  const categoryProducts = await repository.getProducts({ categoryId: category.id });
  const products = categoryProducts.filter((product) => product.available);
  return <>
    <StoreHero store={store} title={category.name} description={category.description} titleId="category-hero-title" />
    <Container className={styles.categorySection}>
      <ProductGrid products={products} emptyTitle="Nenhum produto disponível" emptyDescription="Confira outra categoria para continuar escolhendo." />
    </Container>
  </>;
}
