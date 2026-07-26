import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import logo from "../../../assets/images/logo.webp";
import styles from "@/app/conta/account.module.css";

export function CustomerAuthShell({
  title,
  description,
  children,
  footer,
}) {
  return <main className={styles.authPage}>
    <section className={styles.authShell}>
      <div className={styles.authBrand}>
        <Link className={styles.authBrandLink} href="/">
          <ArrowLeft size={16} />
          Cardápio
        </Link>
        <Image className={styles.authLogo} src={logo} alt="Pizza Express" loading="eager" />
      </div>

      <div className={styles.authPanel}>
        <header className={styles.authPanelHeader}>
          <div>
            <h2>{title}</h2>
            {description && <p>{description}</p>}
          </div>
        </header>
        {children}
        {footer}
      </div>
    </section>
  </main>;
}
