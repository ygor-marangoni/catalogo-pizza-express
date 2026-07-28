"use client";

import Link from "next/link";
import { ArrowLeft, ClipboardList, Eye, ReceiptText } from "lucide-react";
import { useEffect, useState } from "react";
import { Price } from "@/components/ui/Price";
import { useCustomerAuth } from "@/contexts/CustomerAuthContext";
import { customerService } from "@/services/customer-service";
import styles from "../account.module.css";

const statusLabels = {
  PENDING: "Em análise",
  APPROVED: "Aprovado",
  PREPARING: "Preparando",
  OUT_FOR_DELIVERY: "Em entrega",
  COMPLETED: "Concluído",
  DELIVERED: "Entregue",
  CANCELLED: "Cancelado",
};

const statusClass = {
  DELIVERED: styles.statusDone,
  COMPLETED: styles.statusDone,
  CANCELLED: styles.statusCancelled,
  PENDING: styles.statusPending,
  APPROVED: styles.statusPending,
  PREPARING: styles.statusPending,
  OUT_FOR_DELIVERY: styles.statusPending,
};

function formatOrderDate(value) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export default function OrdersPage() {
  const { account, loading } = useCustomerAuth();
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!account) return undefined;
    let active = true;
    customerService.getOrders()
      .then((data) => { if (active) setOrders(data); })
      .catch((exception) => { if (active) setError(exception.message); })
      .finally(() => { if (active) setOrdersLoading(false); });
    return () => { active = false; };
  }, [account]);

  if (loading) {
    return <main className={styles.page}><section className={styles.loadingState}><span className={styles.loadingSpinner} /><p>Carregando seus pedidos...</p></section></main>;
  }

  if (!account) {
    return <main className={styles.page}><section className={styles.emptyState}><p>Entre para acessar seus pedidos.</p><Link className={styles.primary} href="/login?next=/conta/pedidos">Entrar</Link></section></main>;
  }

  return <main className={styles.page}>
    <div className={`${styles.toolbar} ${styles.favoriteToolbar} ${styles.ordersToolbar}`}>
      <div>
        <Link className={styles.backLink} href="/conta"><ArrowLeft size={16} />Minha conta</Link>
        <p className={styles.eyebrow}>Seu histórico</p>
        <h1>Meus pedidos</h1>
        <p>Consulte os pedidos feitos com sua conta e veja os detalhes de cada um.</p>
      </div>
      {orders.length > 0 && <div className={styles.orderSummary}>
        <span className={styles.orderIcon}><ReceiptText size={20} /></span>
        <div><strong>{orders.length} {orders.length === 1 ? "pedido" : "pedidos"}</strong><span>registrados na sua conta</span></div>
      </div>}
    </div>

    {error && <p className={styles.error} role="alert">{error}</p>}

    {ordersLoading ? <section className={styles.loadingState}>
      <span className={styles.loadingSpinner} />
      <p>Buscando seus pedidos...</p>
    </section> : !orders.length && !error ? <section className={styles.emptyState}>
      <div className={styles.emptyIcon}><ClipboardList size={26} /></div>
      <h2>Ainda não há pedidos</h2>
      <p>Quando você fizer seu primeiro pedido, ele aparecerá aqui.</p>
      <Link className={styles.primary} href="/">Conhecer o cardápio</Link>
    </section> : <section className={styles.orderList} aria-label="Histórico de pedidos">
      {orders.map((order) => <article className={styles.orderRow} key={order.id}>
        <span className={styles.orderIcon}><ReceiptText size={19} /></span>
        <strong>Pedido #{order.id}</strong>
        <span className={styles.orderDate}>{formatOrderDate(order.created_at)}</span>
        <span className={`${styles.status} ${statusClass[order.status] || ""}`}>{statusLabels[order.status] || order.status}</span>
        <span className={styles.orderTotal}><Price value={order.total} currentColor="var(--color-text)" /></span>
        <Link className={styles.textLink} href={`/conta/pedidos/${order.id}`}><Eye size={15} />Ver detalhes</Link>
      </article>)}
    </section>}
  </main>;
}
