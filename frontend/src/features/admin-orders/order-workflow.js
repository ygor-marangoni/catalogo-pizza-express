export const ORDER_COLUMNS = [
  { status: "PENDING", label: "Novos", description: "Confirmados pela loja" },
  { status: "PREPARING", label: "Preparando", description: "Em produção" },
  { status: "OUT_FOR_DELIVERY", label: "Em entrega", description: "A caminho do cliente" },
  { status: "COMPLETED", label: "Concluídos", description: "Finalizados" },
];

export const ORDER_STATUS_LABELS = {
  PENDING: "Novo",
  APPROVED: "Aprovado",
  PREPARING: "Preparando",
  OUT_FOR_DELIVERY: "Entrega",
  COMPLETED: "Concluído",
  DELIVERED: "Concluído",
  CANCELLED: "Cancelado",
};

const transitions = {
  PENDING: ["PREPARING", "CANCELLED"],
  APPROVED: ["PREPARING", "CANCELLED"],
  PREPARING: ["PENDING", "OUT_FOR_DELIVERY", "CANCELLED"],
  OUT_FOR_DELIVERY: ["PREPARING", "COMPLETED", "CANCELLED"],
  COMPLETED: ["OUT_FOR_DELIVERY", "CANCELLED"],
  DELIVERED: ["OUT_FOR_DELIVERY", "CANCELLED"],
  CANCELLED: ["PENDING"],
};

export function canMoveOrder(current, next) {
  if (current === next || (current === "DELIVERED" && next === "COMPLETED")) return true;
  return (transitions[current] || []).includes(next);
}

export function normalizeOrderStatus(status) {
  if (status === "DELIVERED") return "COMPLETED";
  return status === "APPROVED" ? "PENDING" : status;
}

export function getNextOrderStatus(status) {
  const nextByStatus = {
    PENDING: "PREPARING",
    APPROVED: "PREPARING",
    PREPARING: "OUT_FOR_DELIVERY",
    OUT_FOR_DELIVERY: "COMPLETED",
  };
  return nextByStatus[status] || null;
}
