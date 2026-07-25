import { EmptyState } from "@/components/ui/EmptyState";
import { ProductCard } from "./ProductCard";
import styles from "./catalog.module.css";

export function ProductGrid({ products, emptyTitle, emptyDescription }) {
  if (!products.length) return <EmptyState title={emptyTitle || "Nenhum produto encontrado"} description={emptyDescription || "Tente alterar os filtros ou explorar outra categoria."} />;
  return <div className={styles.grid}>{products.map((product) => <ProductCard product={product} key={product.id} />)}</div>;
}
