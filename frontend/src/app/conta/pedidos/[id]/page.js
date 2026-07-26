"use client";

import Link from "next/link";
import { ArrowLeft, CalendarDays, ReceiptText } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useCustomerAuth } from "@/contexts/CustomerAuthContext";
import { customerService } from "@/services/customer-service";
import { Price } from "@/components/ui/Price";
import styles from "../../account.module.css";

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

function getItemDetails(item) {
  return [
    item.size?.name && `Tamanho: ${item.size.name}`,
    item.edge?.name && `Borda: ${item.edge.name}`,
    item.additionals?.length > 0 && `Adicionais: ${item.additionals.map((additional) => additional.name).join(", ")}`,
    item.note && `Observação: ${item.note}`,
  ].filter(Boolean).join(" · ");
}

export default function OrderDetailPage() {
  const { account, loading } = useCustomerAuth();
  const params = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!account) return undefined;
    let active = true;
    customerService.getOrder(params.id)
      .then((data) => { if (active) setOrder(data); })
      .catch((exception) => { if (active) setError(exception.message); });
    return () => { active = false; };
  }, [account, params.id]);

  if (loading || (!order && !error)) {
    return <main className={styles.page}><section className={styles.loadingState}><span className={styles.loadingSpinner} /><p>Carregando o pedido...</p></section></main>;
  }

  if (!account) {
    return <main className={styles.page}><section className={styles.emptyState}><p>Entre para acessar este pedido.</p><Link className={styles.primary} href={`/login?next=/conta/pedidos/${params.id}`}>Entrar</Link></section></main>;
  }

  if (error) {
    return <main className={styles.page}><section className={styles.emptyState}><div className={styles.emptyIcon}><ReceiptText size={25} /></div><h2>Não foi possível abrir o pedido</h2><p>{error}</p><Link className={styles.secondary} href="/conta/pedidos">Voltar aos pedidos</Link></section></main>;
  }

  const createdAt = order.created_at
    ? new Intl.DateTimeFormat("pt-BR", { dateStyle: "long", timeStyle: "short" }).format(new Date(order.created_at))
    : null;

  return <main className={styles.page}>
    <div className={`${styles.toolbar} ${styles.favoriteToolbar} ${styles.ordersToolbar}`}>
      <div>
        <Link className={styles.backLink} href="/conta/pedidos"><ArrowLeft size={16} />Meus pedidos</Link>
        <p className={styles.eyebrow}>Detalhes do pedido</p>
        <h1>Pedido #{order.id}</h1>
        <p>Confira os itens, personalizações e o valor registrado.</p>
      </div>
    </div>

    <section className={`${styles.panel} ${styles.narrow}`}>
      <header className={styles.orderDetailHeader}>
        <div>
          <h2>Resumo do pedido</h2>
          {createdAt && <p><CalendarDays size={14} /> {createdAt}</p>}
        </div>
        <span className={`${styles.status} ${statusClass[order.status] || ""}`}>{statusLabels[order.status] || order.status}</span>
      </header>

      <ul className={styles.orderItems}>
        {(order.items || []).map((item, index) => {
          const details = getItemDetails(item);
          return <li className={styles.orderItem} key={`${item.product_id}-${index}`}>
            <span className={styles.orderQuantity}>{item.quantity}x</span>
            <div>
              <span className={styles.orderItemName}>{item.name || item.product_name || `Pizza #${item.product_id}`}</span>
              {details && <span className={styles.orderItemDetails}>{details}</span>}
            </div>
            <Price className={styles.orderItemPrice} value={item.subtotal || item.unit_price * item.quantity} />
          </li>;
        })}
      </ul>

      <footer className={styles.orderFooter}>
        <span>Total do pedido</span>
        <strong><Price value={order.total} /></strong>
      </footer>
    </section>
  </main>;
}
