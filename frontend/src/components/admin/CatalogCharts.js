"use client";

import {
  ArcElement, BarElement, CategoryScale, Chart as ChartJS,
  Legend, LinearScale, Tooltip,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import styles from "@/app/admin.module.css";

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Legend, Tooltip);

const font = { family: "Figtree, Arial, sans-serif" };

export function AvailabilityChart({ available, unavailable }) {
  const total = available + unavailable;
  const data = {
    labels: ["Disponíveis", "Indisponíveis"],
    datasets: [{
      data: [available, unavailable],
      backgroundColor: ["#cf0909", "#f1b8b8"],
      borderColor: "#ffffff",
      borderWidth: 3,
      hoverOffset: 4,
    }],
  };
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "68%",
    plugins: {
      legend: {
        position: "bottom",
        labels: { boxWidth: 10, boxHeight: 10, padding: 20, color: "#716968", font },
      },
      tooltip: { callbacks: { label: (context) => ` ${context.label}: ${context.raw}` } },
    },
  };
  const percentage = total ? Math.round((available / total) * 100) : 0;
  return <div className={styles.chartCanvas}>
    <Doughnut data={data} options={options} aria-label={`${percentage}% dos produtos estão disponíveis`} />
    <div className={styles.chartCenter}><strong>{percentage}%</strong><span>disponível</span></div>
  </div>;
}

export function CategoryChart({ categories }) {
  const data = {
    labels: categories.map((category) => category.name),
    datasets: [{
      label: "Produtos",
      data: categories.map((category) => category.total),
      backgroundColor: "#d90909",
      hoverBackgroundColor: "#b70000",
      borderRadius: 7,
      barThickness: 28,
    }],
  };
  const options = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { beginAtZero: true, ticks: { precision: 0, color: "#716968", font }, grid: { color: "#eee9e7" }, border: { display: false } },
      y: { ticks: { color: "#302928", font: { ...font, weight: 700 } }, grid: { display: false }, border: { display: false } },
    },
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: (context) => ` ${context.raw} produto${context.raw === 1 ? "" : "s"}` } },
    },
  };
  return <div className={styles.barCanvas}><Bar data={data} options={options} aria-label="Quantidade de produtos por categoria" /></div>;
}
