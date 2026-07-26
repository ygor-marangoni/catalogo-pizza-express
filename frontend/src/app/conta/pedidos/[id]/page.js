"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useCustomerAuth } from "@/contexts/CustomerAuthContext";
import { customerService } from "@/services/customer-service";
import { Price } from "@/components/ui/Price";
import styles from "../../account.module.css";

const statusLabels = { PENDING: "Em análise", PREPARING: "Preparando", DELIVERED: "Entregue", CANCELLED: "Cancelado" };

export default function OrderDetailPage() {
  const { account, loading } = useCustomerAuth();
  const params = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (account) customerService.getOrder(params.id).then(setOrder).catch((exception) => setError(exception.message));
  }, [account, params.id]);

  if (loading || (!order && !error)) return <main className={styles.page}>Carregando pedido...</main>;
  if (!account) return <main className={styles.page}><section className={styles.panel}><p>Entre para acessar este pedido.</p><Link href={`/conta/login?next=/conta/pedidos/${params.id}`}>Entrar</Link></section></main>;
  if (error) return <main className={styles.page}><section className={styles.panel}><p className={styles.error}>{error}</p><Link href="/conta/pedidos">Voltar aos pedidos</Link></section></main>;

  return <main className={styles.page}><div className={styles.toolbar}><h1>Pedido #{order.id}</h1><Link href="/conta/pedidos">Voltar</Link></div><section className={styles.panel}><p>Status: <strong>{statusLabels[order.status] || order.status}</strong></p><ul>{(order.items || []).map((item, index) => <li key={`${item.product_id}-${index}`}><strong>{item.quantity}x {item.name}</strong>{item.size && <span> · {item.size.name}</span>}{item.edge && <span> · Borda {item.edge.name}</span>}{item.additionals?.length > 0 && <span> · {item.additionals.map((additional) => additional.name).join(", ")}</span>}{item.note && <small> · {item.note}</small>}<br /><Price value={item.subtotal || item.unit_price * item.quantity} /></li>)}</ul><p><strong>Total: <Price value={order.total} /></strong></p></section></main>;
}
