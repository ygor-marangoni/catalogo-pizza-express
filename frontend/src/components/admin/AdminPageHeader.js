import styles from "@/app/admin.module.css";

export function AdminPageHeader({ eyebrow, title, description, action }) {
  return <header className={styles.pageHeader}>
    <div>
      <span className={styles.eyebrow}>{eyebrow}</span>
      <h1>{title}</h1>
      {description && <p>{description}</p>}
    </div>
    {action && <div className={styles.pageHeaderAction}>{action}</div>}
  </header>;
}
