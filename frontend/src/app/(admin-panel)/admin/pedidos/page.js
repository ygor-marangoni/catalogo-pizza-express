"use client";

import { useEffect, useMemo, useState } from "react";
import { Ban, Check, ChevronRight, ClipboardList, Clock3, Eye, RefreshCw, Search, ShoppingBag, Truck, UserRound } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { useToast } from "@/components/ui/Toast";
import { formatCurrency } from "@/lib/currency";
import { ordersApi } from "@/features/admin-orders/orders-api";
import { ORDER_COLUMNS, ORDER_STATUS_LABELS, canMoveOrder, getNextOrderStatus, normalizeOrderStatus } from "@/features/admin-orders/order-workflow";
import styles from "@/app/admin.module.css";

function formatDate(value) {
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(new Date(value));
}

function itemCount(order) {
  return (order.items || []).reduce((total, item) => total + Number(item.quantity || 0), 0);
}

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [query, setQuery] = useState("");
  const [showCancelled, setShowCancelled] = useState(false);
  const [pendingId, setPendingId] = useState(null);
  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState("");
  const { notify } = useToast();

  async function load() {
    try {
      setMessage("");
      setOrders(await ordersApi.list());
    } catch (error) {
      setMessage(error.message);
    }
  }

  useEffect(() => {
    let active = true;
    ordersApi.list().then((records) => { if (active) setOrders(records); })
      .catch((error) => { if (active) setMessage(error.message); });
    return () => { active = false; };
  }, []);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return orders.filter((order) => {
      const haystack = `${order.id} ${order.customer?.name || ""} ${order.customer?.email || ""}`.toLowerCase();
      return (!term || haystack.includes(term)) && (showCancelled || order.status !== "CANCELLED");
    });
  }, [orders, query, showCancelled]);

  async function move(order, status) {
    if (!canMoveOrder(order.status, status) || pendingId) return;
    setPendingId(order.id);
    try {
      const updated = await ordersApi.updateStatus(order.id, status);
      setOrders((records) => records.map((item) => item.id === order.id ? updated : item));
      notify(`Pedido #${order.id} movido para ${ORDER_STATUS_LABELS[status].toLowerCase()}.`);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setPendingId(null);
    }
  }

  function showDetails(order) {
    setSelected(order);
    document.getElementById("order-dialog")?.showModal();
  }

  return <>
    <AdminPageHeader
      eyebrow="Operação"
      title="Pedidos"
      description="Acompanhe o atendimento em tempo real e avance cada pedido com segurança."
      action={<button className={`${styles.button} ${styles.secondary}`} onClick={load}><RefreshCw size={17} />Atualizar</button>}
    />
    {message && <p className={styles.message} role="status">{message}</p>}
    <section className={styles.orderToolbar}>
      <label className={styles.filterControl}><span>Pesquisar pedido</span><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Pedido, cliente ou e-mail…" /></label>
      <div className={styles.orderSummary}>
        <span><Clock3 size={17} /><strong>{orders.filter((order) => !["COMPLETED", "DELIVERED", "CANCELLED"].includes(order.status)).length}</strong> em andamento</span>
        <button type="button" className={showCancelled ? styles.cancelFilterActive : ""} onClick={() => setShowCancelled((value) => !value)}><Ban size={16} />{showCancelled ? "Ocultar cancelados" : "Ver cancelados"}</button>
      </div>
    </section>

    {orders.length === 0 ? <div className={`${styles.panel} ${styles.emptyState}`}><ClipboardList size={30} /><strong>Nenhum pedido recebido</strong><p>Os novos pedidos aparecerão aqui automaticamente após a atualização.</p></div> :
      <div className={styles.kanban} aria-label="Fluxo de pedidos">
        {ORDER_COLUMNS.map((column) => {
          const records = filtered.filter((order) => normalizeOrderStatus(order.status) === column.status);
          return <section
            className={styles.kanbanColumn}
            key={column.status}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              const order = orders.find((item) => String(item.id) === event.dataTransfer.getData("text/order-id"));
              if (order) move(order, column.status);
            }}
          >
            <header className={styles.kanbanHeader}><div><h2>{column.label}</h2><p>{column.description}</p></div><span>{records.length}</span></header>
            <div className={styles.kanbanList}>
              {records.length === 0 ? <p className={styles.kanbanEmpty}>Nenhum pedido nesta etapa.</p> :
                records.map((order) => {
                  const next = getNextOrderStatus(order.status);
                  return <article
                    className={`${styles.orderCard} ${pendingId === order.id ? styles.orderCardPending : ""}`}
                    key={order.id}
                    draggable={Boolean(next)}
                    onDragStart={(event) => event.dataTransfer.setData("text/order-id", String(order.id))}
                  >
                    <div className={styles.orderCardTop}><div><span>Pedido</span><strong>#{order.id}</strong></div><time>{formatDate(order.created_at)}</time></div>
                    <div className={styles.orderCustomer}><UserRound size={17} /><div><strong>{order.customer?.name || "Conta removida"}</strong><span>{order.customer?.email || "Cliente indisponível"}</span></div></div>
                    <div className={styles.orderFacts}><span><ShoppingBag size={15} />{itemCount(order)} {itemCount(order) === 1 ? "item" : "itens"}</span><strong>{formatCurrency(order.total)}</strong></div>
                    <div className={styles.orderActions}>
                      <button type="button" onClick={() => showDetails(order)}><Eye size={16} />Detalhes</button>
                      {next && <button type="button" className={styles.orderAdvance} disabled={pendingId === order.id} onClick={() => move(order, next)}>{ORDER_STATUS_LABELS[next]}<ChevronRight size={16} /></button>}
                    </div>
                    {!["COMPLETED", "DELIVERED", "CANCELLED"].includes(order.status) &&
                      <button type="button" className={styles.orderCancel} onClick={() => confirm(`Cancelar o pedido #${order.id}?`) && move(order, "CANCELLED")}><Ban size={14} />Cancelar pedido</button>}
                  </article>;
                })}
            </div>
          </section>;
        })}
        {showCancelled && <section className={`${styles.kanbanColumn} ${styles.cancelledColumn}`}>
          <header className={styles.kanbanHeader}><div><h2>Cancelados</h2><p>Histórico da operação</p></div><span>{filtered.filter((order) => order.status === "CANCELLED").length}</span></header>
          <div className={styles.kanbanList}>{filtered.filter((order) => order.status === "CANCELLED").map((order) =>
            <article className={styles.orderCard} key={order.id}><div className={styles.orderCardTop}><div><span>Pedido</span><strong>#{order.id}</strong></div><time>{formatDate(order.created_at)}</time></div><div className={styles.orderCustomer}><UserRound size={17} /><strong>{order.customer?.name || "Conta removida"}</strong></div><button type="button" className={styles.orderDetailsFull} onClick={() => showDetails(order)}><Eye size={16} />Ver detalhes</button></article>)}</div>
        </section>}
      </div>}

    <dialog id="order-dialog" className={`${styles.adminDialog} ${styles.orderDialog}`} onClose={() => setSelected(null)}>
      {selected && <div>
        <header className={styles.dialogHeader}><div><span className={styles.eyebrow}>Pedido #{selected.id}</span><h2>Detalhes do pedido</h2><p>{selected.customer?.name || "Conta removida"} · {formatDate(selected.created_at)}</p></div><button type="button" className={styles.dialogClose} onClick={() => document.getElementById("order-dialog")?.close()} aria-label="Fechar">×</button></header>
        <div className={styles.dialogBody}>
          <div className={styles.orderDetailStatus}><span>Status atual</span><strong><Check size={17} />{ORDER_STATUS_LABELS[selected.status] || selected.status}</strong></div>
          <div className={styles.orderInfoGrid}>
            <div><span>Cliente</span><strong>{selected.customer?.name || "Conta removida"}</strong><small>{selected.phone || selected.customer?.email || "Contato não informado"}</small></div>
            <div><span>Atendimento</span><strong>{selected.fulfillment === "delivery" ? "Entrega" : selected.fulfillment === "pickup" ? "Retirada" : "Não informado"}</strong><small>{selected.payment || "Pagamento não informado"}</small></div>
            {selected.address && <div className={styles.orderInfoWide}><span>Endereço</span><strong>{selected.address}</strong></div>}
            {selected.notes && <div className={styles.orderInfoWide}><span>Observações</span><strong>{selected.notes}</strong></div>}
          </div>
          <div className={styles.orderItems}><h3>Itens</h3>{(selected.items || []).map((item, index) => <div key={`${item.product_id}-${index}`}><span><strong>{item.quantity}× {item.name}</strong><small>{[item.size?.name, item.edge?.name, ...(item.additionals || []).map((additional) => additional.name)].filter(Boolean).join(" · ") || `${formatCurrency(item.unit_price)} cada`}</small></span><strong>{formatCurrency(item.subtotal)}</strong></div>)}</div>
          {(selected.delivery_fee > 0 || selected.discount > 0) && <div className={styles.orderBreakdown}>
            {selected.delivery_fee > 0 && <span><small>Taxa de entrega</small><strong>{formatCurrency(selected.delivery_fee)}</strong></span>}
            {selected.discount > 0 && <span><small>Desconto {selected.coupon_code ? `· ${selected.coupon_code}` : ""}</small><strong>− {formatCurrency(selected.discount)}</strong></span>}
          </div>}
          <div className={styles.orderTotal}><span>Total do pedido</span><strong>{formatCurrency(selected.total)}</strong></div>
        </div>
      </div>}
    </dialog>
  </>;
}
