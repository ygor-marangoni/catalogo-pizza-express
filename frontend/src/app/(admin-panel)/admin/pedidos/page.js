"use client";

import { useEffect, useMemo, useState } from "react";
import { Ban, Bike, Check, ChevronRight, CircleX, ClipboardList, Clock3, Eye, Power, RefreshCw, Search, ShoppingBag, Store, UserRound } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminConfirmDialog } from "@/components/admin/AdminConfirmDialog";
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

function cents(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.round(parsed) : 0;
}

function money(value) {
  return formatCurrency(cents(value));
}

function itemName(item) {
  return item.name || `Produto #${item.product_id}`;
}

function itemSubtotal(item) {
  return cents(item.subtotal || cents(item.unit_price) * Number(item.quantity || 1));
}

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [query, setQuery] = useState("");
  const [showCancelled, setShowCancelled] = useState(false);
  const [pendingId, setPendingId] = useState(null);
  const [draggedId, setDraggedId] = useState(null);
  const [dropStatus, setDropStatus] = useState(null);
  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [confirmation, setConfirmation] = useState(null);
  const { notify } = useToast();

  async function load() {
    setRefreshing(true);
    try {
      setMessage("");
      setOrders(await ordersApi.list());
    } catch (error) {
      setMessage(error.message);
    } finally {
      setRefreshing(false);
    }
  }

  useEffect(() => {
    let active = true;
    ordersApi.list()
      .then((records) => { if (active) setOrders(records); })
      .catch((error) => { if (active) setMessage(error.message); });
    return () => { active = false; };
  }, []);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return orders.filter((order) => {
      const haystack = `${order.id} ${order.customer?.name || ""}`.toLowerCase();
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

  async function closeDay() {
    if (!orders.length) return;
    try {
      const result = await ordersApi.closeDay();
      setOrders([]);
      setShowCancelled(false);
      notify(`Expediente encerrado: ${result.removed} pedidos removidos.`);
    } catch (error) { setMessage(error.message); }
    finally { setConfirmation(null); }
  }

  async function confirmAction() {
    if (!confirmation) return;
    if (confirmation.type === "close-day") return closeDay();
    const order = confirmation.order;
    setConfirmation(null);
    await move(order, "CANCELLED");
  }

  function showDetails(order) {
    setSelected(order);
    requestAnimationFrame(() => document.getElementById("order-dialog")?.showModal());
  }

  function draggedOrder() {
    return orders.find((order) => order.id === draggedId);
  }

  function acceptsDrop(status) {
    const order = draggedOrder();
    return Boolean(order && canMoveOrder(order.status, status));
  }

  function dropOrder(status) {
    const order = draggedOrder();
    setDropStatus(null);
    setDraggedId(null);
    if (order && canMoveOrder(order.status, status)) move(order, status);
  }

  function reorderOrders(sourceId, targetId) {
    setOrders((records) => {
      const sourceIndex = records.findIndex((order) => order.id === sourceId);
      const targetIndex = records.findIndex((order) => order.id === targetId);
      if (sourceIndex < 0 || targetIndex < 0) return records;
      const next = [...records];
      const [moved] = next.splice(sourceIndex, 1);
      next.splice(targetIndex, 0, moved);
      return next;
    });
  }

  function dropOnCard(event, targetOrder) {
    event.preventDefault();
    event.stopPropagation();
    const source = draggedOrder();
    if (!source || source.id === targetOrder.id) return;
    if (normalizeOrderStatus(source.status) === normalizeOrderStatus(targetOrder.status)) {
      reorderOrders(source.id, targetOrder.id);
      setDraggedId(null);
      setDropStatus(null);
      return;
    }
    dropOrder(normalizeOrderStatus(targetOrder.status));
  }

  const ongoingCount = orders.filter((order) => !["COMPLETED", "DELIVERED", "CANCELLED"].includes(order.status)).length;

  return <>
    <AdminPageHeader
      eyebrow="Operação"
      title="Pedidos"
      description="Acompanhe o atendimento em tempo real e arraste os pedidos entre as etapas."
      action={<button className={`${styles.button} ${styles.secondary}`} onClick={load} disabled={refreshing}><RefreshCw className={refreshing ? styles.refreshingIcon : ""} size={17} />Atualizar</button>}
    />
    {message && <p className={styles.message} role="status">{message}</p>}
    <section className={styles.orderToolbar}>
      <label className={styles.filterControl}><span>Pesquisar pedido</span><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Pedido ou cliente…" /></label>
      <div className={styles.orderSummary}>
        <span><Clock3 size={17} /><strong>{ongoingCount}</strong> em andamento</span>
        <button type="button" className={showCancelled ? styles.cancelFilterActive : ""} onClick={() => setShowCancelled((value) => !value)}><Ban size={16} />{showCancelled ? "Ocultar cancelados" : "Ver cancelados"}</button>
        <button type="button" className={styles.closeDayButton} onClick={() => orders.length && setConfirmation({ type: "close-day" })}><Power size={16} />Encerrar expediente</button>
      </div>
    </section>

    {orders.length === 0 ? <div className={`${styles.panel} ${styles.emptyState}`}><ClipboardList size={30} /><strong>Nenhum pedido recebido</strong><p>Os novos pedidos aparecerão aqui automaticamente após a atualização.</p></div> :
      <div className={styles.kanban} aria-label="Fluxo de pedidos">
        {ORDER_COLUMNS.map((column) => {
          const activeRecords = filtered.filter((order) => normalizeOrderStatus(order.status) === column.status);
          const records = column.status === "PENDING" && showCancelled
            ? [...activeRecords, ...filtered.filter((order) => order.status === "CANCELLED")]
            : activeRecords;
          const isDropTarget = dropStatus === column.status && acceptsDrop(column.status);
          return <section
            className={`${styles.kanbanColumn} ${isDropTarget ? styles.kanbanColumnDropTarget : ""}`}
            key={column.status}
            onDragOver={(event) => { if (acceptsDrop(column.status)) event.preventDefault(); }}
            onDragEnter={() => { if (acceptsDrop(column.status)) setDropStatus(column.status); }}
            onDragLeave={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setDropStatus(null); }}
            onDrop={(event) => { event.preventDefault(); dropOrder(column.status); }}
          >
            <header className={styles.kanbanHeader}><div><h2>{column.label}</h2><p>{column.description}</p></div><span>{records.length}</span></header>
            <div className={styles.kanbanList}>
              {records.length === 0 ? <p className={styles.kanbanEmpty}>{isDropTarget ? "Solte o pedido aqui" : "Nenhum pedido nesta etapa."}</p> :
                records.map((order) => {
                  const next = getNextOrderStatus(order.status);
                  return <article
                    className={`${styles.orderCard} ${order.status === "CANCELLED" ? styles.orderCardCancelled : ""} ${pendingId === order.id ? styles.orderCardPending : ""} ${draggedId === order.id ? styles.orderCardDragging : ""}`}
                    key={order.id}
                    draggable={order.status !== "CANCELLED"}
                    onDragStart={(event) => { setDraggedId(order.id); event.dataTransfer.effectAllowed = "move"; }}
                    onDragEnd={() => { setDraggedId(null); setDropStatus(null); }}
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={(event) => dropOnCard(event, order)}
                  >
                    <div className={styles.orderCardTop}><div><span>Pedido</span><strong>#{order.id}</strong></div><time>{formatDate(order.created_at)}</time></div>
                    <div className={styles.orderCustomer}><UserRound size={16} /><strong>{order.customer?.name || "Conta removida"}</strong><span className={styles.orderFulfillment}>{order.fulfillment === "delivery" ? <Bike size={12} /> : <Store size={12} />}{order.fulfillment === "delivery" ? "Entrega" : "Retirada"}</span></div>
                    <div className={styles.orderItemsPreview}>
                      {(order.items || []).slice(0, 3).map((item, index) => <span key={`${item.product_id}-${index}`}><b>{item.quantity}×</b> {itemName(item)}</span>)}
                      {(order.items || []).length > 3 && <small>+{order.items.length - 3} itens</small>}
                    </div>
                    <div className={styles.orderFacts}><span><ShoppingBag size={15} />{itemCount(order)} {itemCount(order) === 1 ? "item" : "itens"}</span><strong>{money(order.total)}</strong></div>
                    <div className={`${styles.orderActions} ${order.status === "CANCELLED" ? styles.orderCancelledActions : ""}`}>
                      {order.status === "CANCELLED" && <button type="button" className={styles.orderReactivate} onClick={() => move(order, "PENDING")}>Reativar pedido</button>}
                      {order.status !== "CANCELLED" &&
                        <button type="button" className={styles.orderCancelIcon} aria-label={`Cancelar pedido #${order.id}`} title="Cancelar pedido" onClick={() => setConfirmation({ type: "cancel-order", order })}><CircleX size={17} /></button>}
                      <button type="button" className={!next ? styles.orderDetailsWide : ""} onClick={() => showDetails(order)}><Eye size={16} />Detalhes</button>
                      {next && <button type="button" className={styles.orderAdvance} disabled={pendingId === order.id} onClick={() => move(order, next)}>{ORDER_STATUS_LABELS[next]}<ChevronRight size={16} /></button>}
                    </div>
                  </article>;
                })}
            </div>
          </section>;
        })}
        {showCancelled && false && <section className={`${styles.kanbanColumn} ${styles.cancelledColumn}`}>
          <header className={styles.kanbanHeader}><div><h2>Cancelados</h2><p>Histórico da operação</p></div><span>{filtered.filter((order) => order.status === "CANCELLED").length}</span></header>
          <div className={styles.kanbanList}>{filtered.filter((order) => order.status === "CANCELLED").map((order) =>
            <article className={styles.orderCard} key={order.id}><div className={styles.orderCardTop}><div><span>Pedido</span><strong>#{order.id}</strong></div><time>{formatDate(order.created_at)}</time></div><div className={styles.orderCustomer}><strong>{order.customer?.name || "Conta removida"}</strong></div><button type="button" className={styles.orderDetailsFull} onClick={() => showDetails(order)}><Eye size={16} />Ver detalhes</button></article>)}</div>
        </section>}
      </div>}

    <dialog id="order-dialog" className={`${styles.adminDialog} ${styles.orderDialog}`} onClose={() => setSelected(null)}>
      {selected && <div>
        <header className={styles.dialogHeader}><div><span className={styles.eyebrow}>Pedido #{selected.id}</span><h2>Detalhes do pedido</h2><p>{selected.customer?.name || "Conta removida"} · {formatDate(selected.created_at)}</p></div><button type="button" className={styles.dialogClose} onClick={() => document.getElementById("order-dialog")?.close()} aria-label="Fechar">×</button></header>
        <div className={styles.dialogBody}>
          <div className={styles.orderDetailStatus}><span>Status atual</span><strong><Check size={17} />{ORDER_STATUS_LABELS[selected.status] || selected.status}</strong></div>
          <div className={styles.orderInfoGrid}>
            <div><span>Cliente</span><strong>{selected.customer?.name || "Conta removida"}</strong><small>{selected.phone || "Contato não informado"}</small></div>
            <div><span>Atendimento</span><strong>{selected.fulfillment === "delivery" ? "Entrega" : selected.fulfillment === "pickup" ? "Retirada" : "Não informado"}</strong><small>{selected.payment || "Pagamento não informado"}</small></div>
            {selected.address && <div className={styles.orderInfoWide}><span>Endereço</span><strong>{selected.address}</strong></div>}
            {selected.notes && <div className={styles.orderInfoWide}><span>Observações</span><strong>{selected.notes}</strong></div>}
          </div>
          <div className={styles.orderItems}><h3>Itens</h3>{(selected.items || []).map((item, index) => <div key={`${item.product_id}-${index}`}><span><strong>{item.quantity}× {itemName(item)}</strong><small>{[item.size?.name, item.edge?.name, ...(item.additionals || []).map((additional) => additional.name)].filter(Boolean).join(" · ") || `${money(item.unit_price)} cada`}</small></span><strong>{money(itemSubtotal(item))}</strong></div>)}</div>
          {(cents(selected.delivery_fee) > 0 || cents(selected.discount) > 0) && <div className={styles.orderBreakdown}>
            {cents(selected.delivery_fee) > 0 && <span><small>Taxa de entrega</small><strong>{money(selected.delivery_fee)}</strong></span>}
            {cents(selected.discount) > 0 && <span><small>Desconto {selected.coupon_code ? `· ${selected.coupon_code}` : ""}</small><strong>− {money(selected.discount)}</strong></span>}
          </div>}
          <div className={styles.orderTotal}><span>Total do pedido</span><strong>{money(selected.total)}</strong></div>
        </div>
      </div>}
    </dialog>
    <AdminConfirmDialog
      open={Boolean(confirmation)}
      title={confirmation?.type === "close-day" ? "Encerrar expediente?" : "Cancelar pedido?"}
      description={confirmation?.type === "close-day" ? `Todos os ${orders.length} pedidos do dia serão removidos do kanban para iniciar um novo expediente.` : confirmation?.order ? `O pedido #${confirmation.order.id} será movido para os cancelados.` : ""}
      confirmLabel={confirmation?.type === "close-day" ? "Encerrar expediente" : "Cancelar pedido"}
      onCancel={() => setConfirmation(null)}
      onConfirm={confirmAction}
    />
  </>;
}
