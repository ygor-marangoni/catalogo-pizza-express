class CouponService {
	constructor(private readonly repository: any) {}

	getAllCoupons(filters = {}) { return this.repository.findAll(filters); }

	async getPublicCoupons() {
		const coupons = await this.repository.findAll({ active: true });
		const now = Date.now();
		return coupons
			.filter((coupon) => !coupon.expires_at || new Date(coupon.expires_at).getTime() >= now)
			.map((coupon) => ({
				code: coupon.code,
				description: coupon.description,
				discount_type: coupon.discount_type,
				discount_value: coupon.discount_value,
				min_order_value: coupon.min_order_value,
				expires_at: coupon.expires_at,
			}));
	}

	async getCouponById(id: number) {
		const coupon = await this.repository.findById(id);
		if (!coupon) throw Object.assign(new Error("Cupom não encontrado"), { statusCode: 404, code: "COUPON_NOT_FOUND" });
		return coupon;
	}

	createCoupon(data: any) {
		return this.repository.create(this.normalize(data));
	}

	updateCoupon(id: number, data: any) {
		return this.repository.update(id, this.normalize(data));
	}

	deleteCoupon(id: number) { return this.repository.delete(id); }

	async validate(code: string, subtotal: number) {
		const coupons = await this.repository.findAll({ code: code.trim().toUpperCase() });
		const coupon = coupons[0];
		if (!coupon || !coupon.active) throw Object.assign(new Error("Cupom inválido ou inativo"), { statusCode: 404, code: "INVALID_COUPON" });
		if (coupon.expires_at && new Date(coupon.expires_at).getTime() < Date.now())
			throw Object.assign(new Error("Este cupom expirou"), { statusCode: 400, code: "EXPIRED_COUPON" });
		if (subtotal < coupon.min_order_value)
			throw Object.assign(new Error(`Pedido mínimo de ${coupon.min_order_value} centavos para este cupom`), { statusCode: 400, code: "MINIMUM_NOT_REACHED" });
		const discount = coupon.discount_type === "PERCENTAGE"
			? Math.floor(subtotal * coupon.discount_value / 100)
			: coupon.discount_value;
		const discountInCents = Math.min(discount, subtotal);
		return {
			id: coupon.id,
			code: coupon.code,
			description: coupon.description,
			discount_type: coupon.discount_type,
			discount_value: coupon.discount_value,
			discount_in_cents: discountInCents,
			final_subtotal_in_cents: subtotal - discountInCents,
		};
	}

	private normalize(data: any) {
		const normalized = { ...data };
		if (normalized.code !== undefined) normalized.code = String(normalized.code).trim().toUpperCase();
		if (normalized.expires_at === "") normalized.expires_at = null;
		return normalized;
	}
}

export = CouponService;
