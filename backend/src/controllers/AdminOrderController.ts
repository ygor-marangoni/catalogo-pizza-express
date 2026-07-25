export class AdminOrderController {
	constructor(private readonly orderRepository: any) {}

	async list(req, res, next) {
		try {
			const orders = await this.orderRepository.findAll({
				status: req.query.status,
			});
			res.json({ success: true, data: orders, error: null });
		} catch (error) {
			next(error);
		}
	}

	async updateStatus(req, res, next) {
		try {
			const order = await this.orderRepository.findById(Number(req.params.id));
			if (!order)
				throw Object.assign(new Error("Pedido não encontrado"), {
					code: "ORDER_NOT_FOUND",
					statusCode: 404,
				});
			const updated = await this.orderRepository.update(order.id, {
				status: req.body.status,
			});
			res.json({ success: true, data: updated, error: null });
		} catch (error) {
			next(error);
		}
	}
}
