import styles from "./ui.module.css";

export function Button({ children, variant = "primary", block = false, className = "", type = "button", ...props }) {
  return <button type={type} className={`${styles.button} ${styles[variant]} ${block ? styles.block : ""} ${className}`.trim()} {...props}>{children}</button>;
}
