import { parseResourceId } from "../utils/ResourceId";

const transitions: Record<string, string[]> = {
	PENDING: ["PREPARING", "CANCELLED"],
	APPROVED: ["PREPARING", "CANCELLED"],
	PREPARING: ["PENDING", "OUT_FOR_DELIVERY", "CANCELLED"],
	OUT_FOR_DELIVERY: ["PREPARING", "COMPLETED", "DELIVERED", "CANCELLED"],
	COMPLETED: ["OUT_FOR_DELIVERY", "CANCELLED"],
	DELIVERED: ["OUT_FOR_DELIVERY", "CANCELLED"],
	CANCELLED: ["PENDING"],
};

export class AdminOrderController {
	constructor(
		private readonly orderRepository: any,
		private readonly userRepository: any,
		private readonly productRepository: any,
	) {}

	async list(req, res, next) {
		try {
			const orders = await this.orderRepository.findAll({ status: req.query.status });
			res.json({ success: true, data: await this.withCustomers(orders), error: null });
		} catch (error) {
			next(error);
		}
	}

	async get(req, res, next) {
		try {
			const order = await this.findOrder(req.params.id);
			res.json({ success: true, data: (await this.withCustomers([order]))[0], error: null });
		} catch (error) {
			next(error);
		}
	}

	async updateStatus(req, res, next) {
		try {
			const order = await this.findOrder(req.params.id);
			this.assertTransition(order.status, req.body.status);
			const updated = await this.orderRepository.update(order.id, { status: req.body.status });
			res.json({ success: true, data: (await this.withCustomers([updated]))[0], error: null });
		} catch (error) {
			next(error);
		}
	}

	async closeDay(req, res, next) {
		try {
			const orders = await this.orderRepository.findAll();
			await Promise.all(orders.map((order) => this.orderRepository.delete(order.id)));
			res.json({ success: true, data: { removed: orders.length }, error: null });
		} catch (error) {
			next(error);
		}
	}

	private async findOrder(id: string) {
		const order = await this.orderRepository.findById(parseResourceId(id));
		if (!order) {
			throw Object.assign(new Error("Pedido não encontrado"), {
				code: "ORDER_NOT_FOUND",
				statusCode: 404,
			});
		}
		return order;
	}

	private assertTransition(current: string, next: string) {
		if (current === next) return;
		if (!(transitions[current] || []).includes(next)) {
			throw Object.assign(new Error("Transição de status não permitida"), {
				code: "INVALID_ORDER_TRANSITION",
				statusCode: 409,
			});
		}
	}

	private async withCustomers(orders: any[]) {
		const users = await this.userRepository.findAll();
		const products = await this.productRepository.findAll();
		const byId = new Map(users.map((user) => [user.id, user]));
		const productsById = new Map(products.map((product) => [product.id, product]));
		return orders.map((order) => {
			const user: any = byId.get(order.user_id);
			return {
				...order,
				items: (order.items || []).map((item) => {
					const product: any = productsById.get(item.product_id);
					const unitPrice = Number.isInteger(item.unit_price) ? item.unit_price : product?.base_price || 0;
					const quantity = Number.isInteger(item.quantity) && item.quantity > 0 ? item.quantity : 1;
					return {
						...item,
						name: item.name || product?.name || `Produto #${item.product_id}`,
						unit_price: unitPrice,
						subtotal: Number.isInteger(item.subtotal) ? item.subtotal : unitPrice * quantity,
					};
				}),
				customer: user ? { id: user.id, name: user.name, email: user.email } : null,
			};
		});
	}
}
