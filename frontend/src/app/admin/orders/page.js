"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useCallback, useEffect, useState } from "react";
import { catalogService } from "@/services/catalog-service";
import styles from "../admin.module.css";

const statuses = ["PENDING", "PREPARING", "DELIVERED", "CANCELLED"];
const labels = { PENDING: "Em análise", PREPARING: "Preparando", DELIVERED: "Entregue", CANCELLED: "Cancelado" };

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try { setOrders(await catalogService.getAdminOrders(status)); }
    catch (requestError) { setError(requestError.message); }
    finally { setLoading(false); }
  }, [status]);

  useEffect(() => { load(); }, [load]);

  async function updateStatus(id, nextStatus) {
    setSavingId(id); setError("");
    try {
      const updated = await catalogService.updateAdminOrderStatus(id, nextStatus);
      setOrders((current) => current.map((order) => order.id === id ? updated : order));
    } catch (requestError) { setError(requestError.message); }
    finally { setSavingId(null); }
  }

  return <>
    <div className={styles.toolbar}><div><h1>Pedidos</h1><p>Pedidos registrados pelos clientes.</p></div><label>Filtrar status<select value={status} onChange={(event) => setStatus(event.target.value)}><option value="">Todos</option>{statuses.map((item) => <option value={item} key={item}>{labels[item]}</option>)}</select></label></div>
    {error && <p className={styles.error} role="alert">{error}</p>}
    <section className={styles.panel} aria-live="polite">{loading ? <p className={styles.loading}>Carregando pedidos…</p> : !orders.length ? <p className={styles.empty}>Nenhum pedido encontrado.</p> : <div className={styles.orderList}>{orders.map((order) => <article className={styles.resourceCard} key={order.id}><div className={styles.resourceCardHeader}><strong>Pedido #{order.id}</strong><span className={styles.status}>{labels[order.status] || order.status}</span></div><p>{order.items?.length || 0} item(ns) · R$ {(Number(order.total || 0) / 100).toFixed(2).replace(".", ",")}</p><label>Status<select value={order.status} disabled={savingId === order.id} onChange={(event) => updateStatus(order.id, event.target.value)}>{statuses.map((item) => <option value={item} key={item}>{labels[item]}</option>)}</select></label></article>)}</div>}</section>
  </>;
}
