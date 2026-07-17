import styles from "./ui.module.css";

export function Container({ children, className = "", as: Tag = "div" }) {
  return <Tag className={`${styles.container} ${className}`.trim()}>{children}</Tag>;
}
