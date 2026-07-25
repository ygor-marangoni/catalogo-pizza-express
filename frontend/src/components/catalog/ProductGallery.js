import Image from "next/image";
import styles from "./catalog.module.css";

export function ProductGallery({ product }) {
  return <div className={styles.gallery}>
    <div className={styles.mainImage}><Image src={product.images[0]} alt={`Imagem principal de ${product.name}`} fill loading="eager" sizes="(max-width: 780px) 100vw, 55vw" /></div>
    {product.images.length > 1 && <div className={styles.thumbs}>{product.images.slice(1).map((image, index) => <div className={styles.thumb} key={image}><Image src={image} alt={`Detalhe ${index + 2} de ${product.name}`} fill sizes="160px" /></div>)}</div>}
  </div>;
}
