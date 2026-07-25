import styles from "./ui.module.css";

export function Skeleton({ width = "100%", height = "1rem", className = "" }) {
  return <span className={`${styles.skeleton} ${className}`.trim()} style={{ width, height }} aria-hidden="true" />;
}
