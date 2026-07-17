import styles from "./ui.module.css";

export function Card({ children, className = "", as: Tag = "article" }) {
  return <Tag className={`${styles.card} ${className}`.trim()}>{children}</Tag>;
}
