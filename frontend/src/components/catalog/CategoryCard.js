import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import styles from "./catalog.module.css";

export function CategoryCard({ category }) {
  return <Link href={`/categoria/${category.slug}`} className={`${styles.categoryCard} ${category.accent ? styles.categoryAccent : ""}`}>
    {category.image && <Image src={category.image} alt="" fill sizes="(max-width: 480px) 78vw, 320px" />}
    <span className={styles.categoryOverlay}><strong>{category.name}<ArrowRight size={18} aria-hidden="true" /></strong></span>
  </Link>;
}
