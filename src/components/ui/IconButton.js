import styles from "./ui.module.css";

export function IconButton({ label, children, className = "", type = "button", ...props }) {
  return <button type={type} aria-label={label} className={`${styles.iconButton} ${className}`.trim()} {...props}>{children}</button>;
}
