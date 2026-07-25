import styles from "./catalog.module.css";
import { CategoryCard } from "./CategoryCard";

export function CategoryRail({ categories }) {
  return <div className={styles.categoryRail} aria-label="Categorias do cardápio">{categories.map((category) => <CategoryCard category={category} key={category.id} />)}</div>;
}
