export const ORDER_COLUMNS = [
  { status: "PENDING", label: "Novos", description: "Aguardando aprovação" },
  { status: "APPROVED", label: "Aprovados", description: "Confirmados pela loja" },
  { status: "PREPARING", label: "Preparando", description: "Em produção" },
  { status: "OUT_FOR_DELIVERY", label: "Em entrega", description: "A caminho do cliente" },
  { status: "COMPLETED", label: "Concluídos", description: "Finalizados" },
];

export const ORDER_STATUS_LABELS = {
  PENDING: "Novo",
  APPROVED: "Aprovado",
  PREPARING: "Preparando",
  OUT_FOR_DELIVERY: "Em entrega",
  COMPLETED: "Concluído",
  DELIVERED: "Concluído",
  CANCELLED: "Cancelado",
};

const transitions = {
  PENDING: ["APPROVED", "CANCELLED"],
  APPROVED: ["PREPARING", "CANCELLED"],
  PREPARING: ["OUT_FOR_DELIVERY", "CANCELLED"],
  OUT_FOR_DELIVERY: ["COMPLETED", "CANCELLED"],
  COMPLETED: [],
  DELIVERED: [],
  CANCELLED: [],
};

export function canMoveOrder(current, next) {
  if (current === next || (current === "DELIVERED" && next === "COMPLETED")) return true;
  return (transitions[current] || []).includes(next);
}

export function normalizeOrderStatus(status) {
  return status === "DELIVERED" ? "COMPLETED" : status;
}

export function getNextOrderStatus(status) {
  return (transitions[status] || []).find((candidate) => candidate !== "CANCELLED") || null;
}
