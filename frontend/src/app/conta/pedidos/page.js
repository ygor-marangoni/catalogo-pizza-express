"use client";

import Link from "next/link";
import { ArrowLeft, ClipboardList, Eye } from "lucide-react";
import { useEffect, useState } from "react";
import { Price } from "@/components/ui/Price";
import { useCustomerAuth } from "@/contexts/CustomerAuthContext";
import { customerService } from "@/services/customer-service";
import styles from "../account.module.css";

const statusLabels = { PENDING: "Em análise", PREPARING: "Preparando", DELIVERED: "Entregue", CANCELLED: "Cancelado" };
const statusClass = { DELIVERED: styles.statusDone, CANCELLED: styles.statusCancelled, PENDING: styles.statusPending, PREPARING: styles.statusPending };

export default function OrdersPage() {
  const { account, loading } = useCustomerAuth();
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!account) return undefined;
    let active = true;
    customerService.getOrders().then((data) => { if (active) setOrders(data); }).catch((exception) => { if (active) setError(exception.message); }).finally(() => { if (active) setOrdersLoading(false); });
    return () => { active = false; };
  }, [account]);

  if (loading) return <main className={styles.page}><div className={styles.panel}>Carregando seus pedidos…</div></main>;
  if (!account) return <main className={styles.page}><section className={styles.panel}><p>Entre para acessar seus pedidos.</p><Link className={styles.primary} href="/conta/login?next=/conta/pedidos">Entrar</Link></section></main>;

  return <main className={styles.page}>
    <div className={styles.toolbar}><div><Link className={styles.backLink} href="/conta"><ArrowLeft size={16} />Minha conta</Link><h1>Meus pedidos</h1><p>Revise seus pedidos e acompanhe o histórico.</p></div></div>
    {error && <p className={styles.error}>{error}</p>}
    {ordersLoading ? <section className={styles.panel}>Buscando seus pedidos…</section> : !orders.length && !error ? <section className={styles.emptyState}><div className={styles.emptyIcon}><ClipboardList size={25} /></div><h2>Ainda não há pedidos</h2><p>Quando você fizer seu primeiro pedido, ele aparecerá aqui.</p><Link className={styles.primary} href="/">Conhecer o cardápio</Link></section> : <section className={styles.orderList} aria-label="Histórico de pedidos">
      {orders.map((order) => <article className={styles.orderRow} key={order.id}><strong>Pedido #{order.id}</strong><span className={styles.orderDate}>{new Date(order.created_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}</span><span className={`${styles.status} ${statusClass[order.status] || ""}`}>{statusLabels[order.status] || order.status}</span><span className={styles.orderTotal}><Price value={order.total} /></span><Link className={styles.textLink} href={`/conta/pedidos/${order.id}`}><Eye size={15} />Ver detalhes</Link></article>)}
    </section>}
  </main>;
}
