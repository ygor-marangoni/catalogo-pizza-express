import Link from "next/link";
import { CartContents } from "@/components/cart/CartContents";
import { Container } from "@/components/ui/Container";
import cartStyles from "@/components/cart/cart.module.css";
import styles from "../storefront.module.css";

export const metadata = { title: "Carrinho", description: "Revise os itens escolhidos no cardápio." };

export default function CartPage() {
  return <Container className={cartStyles.page}>
    <nav className={styles.breadcrumb} aria-label="Breadcrumb"><Link href="/">Início</Link><span aria-hidden="true">/</span><span aria-current="page">Carrinho</span></nav>
    <header className={styles.pageHeader}><h1>Seu carrinho</h1><p>Revise quantidades e escolhas. Nenhum pedido será enviado nesta etapa.</p></header>
    <CartContents page />
  </Container>;
}
