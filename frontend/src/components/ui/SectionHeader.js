import styles from "./ui.module.css";

export function SectionHeader({ title, description, action, as: Tag = "h2" }) {
  return <div className={styles.sectionHeader}><div><Tag>{title}</Tag>{description && <p>{description}</p>}</div>{action}</div>;
}
