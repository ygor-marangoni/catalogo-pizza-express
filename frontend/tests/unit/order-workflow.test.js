import { describe, expect, it } from "vitest";
import {
  canMoveOrder,
  getNextOrderStatus,
  normalizeOrderStatus,
} from "@/features/admin-orders/order-workflow";

describe("fluxo administrativo de pedidos", () => {
  it("permite somente a progressão operacional esperada", () => {
    expect(canMoveOrder("PENDING", "PREPARING")).toBe(true);
    expect(canMoveOrder("PREPARING", "OUT_FOR_DELIVERY")).toBe(true);
    expect(canMoveOrder("OUT_FOR_DELIVERY", "COMPLETED")).toBe(true);
    expect(canMoveOrder("PENDING", "COMPLETED")).toBe(false);
    expect(canMoveOrder("COMPLETED", "PREPARING")).toBe(false);
  });

  it("permite cancelar e reabrir pedidos quando necessário", () => {
    expect(canMoveOrder("PREPARING", "CANCELLED")).toBe(true);
    expect(canMoveOrder("COMPLETED", "CANCELLED")).toBe(true);
    expect(canMoveOrder("CANCELLED", "PENDING")).toBe(true);
  });

  it("mantém pedidos entregues antigos na coluna de concluídos", () => {
    expect(normalizeOrderStatus("DELIVERED")).toBe("COMPLETED");
    expect(getNextOrderStatus("PENDING")).toBe("PREPARING");
    expect(getNextOrderStatus("COMPLETED")).toBeNull();
  });
});
