import { CircleAlert } from "lucide-react";
import styles from "./ui.module.css";

export function ErrorState({ title = "Não foi possível carregar", description, action }) {
  return <div className={styles.state} role="alert"><CircleAlert size={34} aria-hidden="true" /><h2>{title}</h2><p>{description}</p>{action}</div>;
}
