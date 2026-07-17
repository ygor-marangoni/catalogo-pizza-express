import { SearchX } from "lucide-react";
import styles from "./ui.module.css";

export function EmptyState({ title = "Nada por aqui", description, action }) {
  return <div className={styles.state}><SearchX size={34} aria-hidden="true" /><h2>{title}</h2><p>{description}</p>{action}</div>;
}
