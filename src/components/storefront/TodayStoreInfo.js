"use client";

import { Clock3 } from "lucide-react";
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
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  const schedule = businessHours.find((item) => item.day === WEEKDAY_KEYS[values.weekday]);
  if (!schedule) return "closed|Fechado hoje";

  const toMinutes = (value) => {
    const [hour, minute] = value.split(":").map(Number);
    return (hour * 60) + minute;
  };
  const now = (Number(values.hour) * 60) + Number(values.minute);
  const opensAt = toMinutes(schedule.open);
  const closesAt = toMinutes(schedule.close);
  const status = now >= opensAt && now < closesAt
    ? (closesAt - now <= 30 ? "closing" : "open")
    : "closed";

  return `${status}|Hoje: ${schedule.open} - ${schedule.close}`;
}

export function TodayStoreInfo({ businessHours, timeZone }) {
  const todaySnapshot = useSyncExternalStore(
    subscribeToDayChange,
    () => getTodayHours(businessHours, timeZone),
    () => "pending|Horário de hoje",
  );
  const [status, todayHours] = todaySnapshot.split("|");
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
  </div>;
}
