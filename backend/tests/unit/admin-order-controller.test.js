import { describe, expect, it, vi } from "vitest";
import { AdminOrderController } from "../../src/controllers/AdminOrderController";

describe("AdminOrderController", () => {
  it("impede pular etapas do fluxo do pedido", async () => {
    const repository = {
      findById: vi.fn().mockResolvedValue({ id: 4, status: "PREPARING" }),
      update: vi.fn(),
    };
    const controller = new AdminOrderController(repository, { findAll: vi.fn() }, { findAll: vi.fn() });
    const next = vi.fn();
    const response = { status: vi.fn().mockReturnThis(), json: vi.fn() };

    await controller.updateStatus({ params: { id: "4" }, body: { status: "COMPLETED" } }, response, next);

    expect(next).toHaveBeenCalledWith(expect.objectContaining({ code: "INVALID_ORDER_TRANSITION", statusCode: 409 }));
    expect(repository.update).not.toHaveBeenCalled();
  });
});
