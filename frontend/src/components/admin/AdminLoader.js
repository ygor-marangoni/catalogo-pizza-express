import styles from "@/app/admin.module.css";

function PizzaFace({ className = "" }) {
  return <g className={className}>
    <circle className={styles.adminLoaderCrust} cx="36" cy="36" r="25" />
    <circle className={styles.adminLoaderCheese} cx="36" cy="36" r="20.5" />
    <g className={styles.adminLoaderCuts}>
      <path d="M36 36 36 16" /><path d="M36 36 50 22" />
      <path d="M36 36 56 36" /><path d="M36 36 50 50" />
      <path d="M36 36 36 56" /><path d="M36 36 22 50" />
      <path d="M36 36 16 36" /><path d="M36 36 22 22" />
    </g>
    <circle className={styles.adminLoaderPepperoni} cx="25" cy="27" r="3.4" />
    <circle className={styles.adminLoaderPepperoni} cx="40" cy="24" r="3.4" />
    <circle className={styles.adminLoaderPepperoni} cx="49" cy="34" r="3.4" />
    <circle className={styles.adminLoaderPepperoni} cx="31" cy="39" r="3.4" />
    <circle className={styles.adminLoaderPepperoni} cx="43" cy="47" r="3.4" />
    <circle className={styles.adminLoaderPepperoni} cx="23" cy="49" r="3.1" />
  </g>;
}

export function AdminLoader({ label = "Carregando conteúdo", fullScreen = false }) {
  return <div className={`${styles.adminLoader} ${fullScreen ? styles.adminLoaderScreen : ""}`} role="status" aria-live="polite" aria-label={label}>
    <svg className={styles.adminLoaderSvg} viewBox="0 0 72 72" aria-hidden="true">
      <defs>
        <clipPath id="admin-loader-half-slice"><path d="M17 56A28 28 0 0 1 17 16L39 36Z" /></clipPath>
      </defs>
      <g className={styles.adminLoaderSpin}>
        <g className={styles.adminLoaderFrameOne}><PizzaFace /></g>
        <g className={styles.adminLoaderFrameTwo}>
          <PizzaFace />
          <path className={styles.adminLoaderCut} d="M36 36 17 10 31 28 36 36 41 28 55 10Z" />
        </g>
        <g className={styles.adminLoaderFrameThree}>
          <PizzaFace />
        </g>
        <g className={styles.adminLoaderFrameFour}>
          <g clipPath="url(#admin-loader-half-slice)"><PizzaFace /></g>
        </g>
      </g>
    </svg>
    <span>{label}</span>
  </div>;
}
