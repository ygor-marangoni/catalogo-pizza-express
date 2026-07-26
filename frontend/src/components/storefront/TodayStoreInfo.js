"use client";

import { Bike, Clock3, ShoppingBag, Timer } from "lucide-react";
import { useSyncExternalStore } from "react";
import styles from "@/app/(storefront)/storefront.module.css";

const WEEKDAY_KEYS = {
  Sun: "sun",
  Mon: "mon",
  Tue: "tue",
  Wed: "wed",
  Thu: "thu",
  Fri: "fri",
  Sat: "sat",
};

function subscribeToDayChange(callback) {
  const intervalId = window.setInterval(callback, 60_000);
  return () => window.clearInterval(intervalId);
}

function getTodayHours(businessHours, timeZone) {
  if (!Array.isArray(businessHours) || businessHours.length === 0) {
    return "closed|Horário indisponível";
  }
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  const schedule = businessHours.find((item) => item?.day === WEEKDAY_KEYS[values.weekday]);
  if (!schedule) return "closed|Fechado hoje";

  const toMinutes = (value) => {
    if (!/^\d{2}:\d{2}$/.test(value || "")) return null;
    const [hour, minute] = value.split(":").map(Number);
    return (hour * 60) + minute;
  };
  const now = (Number(values.hour) * 60) + Number(values.minute);
  const opensAt = toMinutes(schedule.open);
  const closesAt = toMinutes(schedule.close);
  if (opensAt === null || closesAt === null) return "closed|Horário indisponível";
  const status = now >= opensAt && now < closesAt
    ? (closesAt - now <= 30 ? "closing" : "open")
    : "closed";

  return `${status}|Hoje: ${schedule.open} - ${schedule.close}`;
}

export function TodayStoreInfo({ businessHours, timeZone, storeIsOpen, deliveryEnabled, pickupEnabled, estimatedTime }) {
  const todaySnapshot = useSyncExternalStore(
    subscribeToDayChange,
    () => getTodayHours(businessHours, timeZone),
    () => "pending|Horário de hoje",
  );
  const [scheduleStatus, todayHours] = todaySnapshot.split("|");
  const status = storeIsOpen === true
    ? "open"
    : storeIsOpen === false
      ? "closed"
      : scheduleStatus;
  const statusLabel = {
    open: "Aberto agora",
    closing: "Fecha em até 30 minutos",
    closed: "Fechado agora",
    pending: "Consultando funcionamento",
  }[status];
  const visibleStatus = status === "closed" ? "Fechado" : status === "pending" ? "Consultando" : "Aberto";

  return <div className={styles.heroInfo} aria-label="Informações da loja">
    <p className={styles.heroHours}>
      <Clock3 size={15} strokeWidth={1.8} aria-hidden="true" />
      <span className="sr-only">{statusLabel}. </span>
      <span>{todayHours}</span>
      <strong className={`${styles.heroStatus} ${styles[status]}`}>{visibleStatus}</strong>
    </p>
    <div className={styles.heroServices} aria-label="Modalidades e tempo estimado">
      {deliveryEnabled && <span><Bike size={14} aria-hidden="true" />Entrega</span>}
      {pickupEnabled && <span><ShoppingBag size={14} aria-hidden="true" />Retirada</span>}
      {estimatedTime && <span><Timer size={14} aria-hidden="true" />Estimativa: {estimatedTime}</span>}
    </div>
  </div>;
}
