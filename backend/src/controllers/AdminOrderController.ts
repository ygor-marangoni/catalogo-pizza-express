import { parseResourceId } from "../utils/ResourceId";

const transitions: Record<string, string[]> = {
	PENDING: ["APPROVED", "CANCELLED"],
	APPROVED: ["PREPARING", "CANCELLED"],
	PREPARING: ["OUT_FOR_DELIVERY", "CANCELLED"],
	OUT_FOR_DELIVERY: ["COMPLETED", "DELIVERED", "CANCELLED"],
	COMPLETED: [],
	DELIVERED: [],
	CANCELLED: [],
};

export class AdminOrderController {
	constructor(
		private readonly orderRepository: any,
		private readonly userRepository: any,
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
		const byId = new Map(users.map((user) => [user.id, user]));
		return orders.map((order) => {
			const user: any = byId.get(order.user_id);
			return {
				...order,
				customer: user ? { id: user.id, name: user.name, email: user.email } : null,
			};
		});
	}
}
