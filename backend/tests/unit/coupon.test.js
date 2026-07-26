const CouponService = require("../../dist/src/services/CouponService");
const { InMemoryRepository } = require("../../dist/src/repositories/InMemoryRepository");

describe("serviço de cupons", () => {
	it("normaliza, cria e valida desconto percentual", async () => {
		const service = new CouponService(new InMemoryRepository());
		const created = await service.createCoupon({
			code: " pizza10 ",
			discount_type: "PERCENTAGE",
			discount_value: 10,
			min_order_value: 5000,
			active: true,
		});
		expect(created.code).toBe("PIZZA10");
		const result = await service.validate("pizza10", 10000);
		expect(result.discount_in_cents).toBe(1000);
		expect(result.final_subtotal_in_cents).toBe(9000);
	});

	it("limita desconto fixo ao subtotal e recusa cupom inativo", async () => {
		const service = new CouponService(new InMemoryRepository());
		await service.createCoupon({
			code: "FIXO",
			discount_type: "FIXED",
			discount_value: 10000,
			min_order_value: 0,
			active: true,
		});
		expect((await service.validate("FIXO", 4500)).discount_in_cents).toBe(4500);
		await service.createCoupon({
			code: "INATIVO",
			discount_type: "PERCENTAGE",
			discount_value: 5,
			active: false,
		});
		await expect(service.validate("INATIVO", 5000)).rejects.toMatchObject({ code: "INVALID_COUPON" });
	});

	it("atualiza, exclui logicamente e permite reutilizar o código excluído", async () => {
		const service = new CouponService(new InMemoryRepository());
		const created = await service.createCoupon({
			code: "PROMO22",
			discount_type: "PERCENTAGE",
			discount_value: 22,
			min_order_value: 0,
			active: true,
		});

		const updated = await service.updateCoupon(created.id, { discount_value: 25 });
		expect(updated.discount_value).toBe(25);

		await service.deleteCoupon(created.id);
		await expect(service.getCouponById(created.id)).rejects.toMatchObject({ code: "COUPON_NOT_FOUND" });

		const recreated = await service.createCoupon({
			code: "promo22",
			discount_type: "PERCENTAGE",
			discount_value: 10,
			min_order_value: 0,
			active: true,
		});
		expect(recreated.code).toBe("PROMO22");
		expect(recreated.id).not.toBe(created.id);
	});
});
