import type { UpdateUserReqDTO } from "../dtos/req";
import type { FavoriteResDTO, OrderResDTO, ProductResDTO } from "../dtos/res";

export class UserController {
	// Expõe operações limitadas aos dados do cliente autenticado.
	constructor(
		private readonly authService: any,
		private readonly productRepository: any,
		private readonly orderRepository: any,
		private readonly favoriteRepository: any,
	) {}

	async getProfile(req, res, next) {
		try {
			const user = await this.authService.getUserById(req.user.id);
			res.json({ success: true, data: this.publicUser(user), error: null });
		} catch (error) {
			next(error);
		}
	}

	async updateProfile(req, res, next) {
		try {
			const user = await this.authService.updateUser(req.user.id, req.body as UpdateUserReqDTO);
			res.json({ success: true, data: this.publicUser(user), error: null });
		} catch (error) {
			next(error);
		}
	}

	async listFavorites(req, res, next) {
		try {
			const favorites = await this.favoriteRepository.findAll({
				user_id: req.user.id,
			});
			res.json({ success: true, data: favorites, error: null });
		} catch (error) {
			next(error);
		}
	}

	async addFavorite(req, res, next) {
		try {
			const productId = req.body.product_id;
			if (!(await this.productRepository.getProductById(productId)))
				throw this.error("PRODUCT_NOT_FOUND", "Produto não encontrado", 404);
			if (
				(
					await this.favoriteRepository.findAll({
						user_id: req.user.id,
						product_id: productId,
					})
				).length > 0
			)
				throw this.error("FAVORITE_ALREADY_EXISTS", "Produto já está nos favoritos", 409);
			const favorite = await this.favoriteRepository.create({
				user_id: req.user.id,
				product_id: productId,
			} as Partial<FavoriteResDTO>);
			res.status(201).json({ success: true, data: favorite, error: null });
		} catch (error) {
			next(error);
		}
	}

	async removeFavorite(req, res, next) {
		try {
			const favorite = await this.favoriteRepository.findById(Number(req.params.id));
			if (!favorite || favorite.user_id !== req.user.id)
				throw this.error("FAVORITE_NOT_FOUND", "Favorito não encontrado", 404);
			await this.favoriteRepository.delete(favorite.id);
			res.json({ success: true, data: null, error: null });
		} catch (error) {
			next(error);
		}
	}

	async listOrders(req, res, next) {
		try {
			const orders = await this.orderRepository.findAll({
				user_id: req.user.id,
			});
			res.json({ success: true, data: orders, error: null });
		} catch (error) {
			next(error);
		}
	}

	async getOrder(req, res, next) {
		try {
			const order = await this.orderRepository.findById(Number(req.params.id));
			if (!order || order.user_id !== req.user.id)
				throw this.error("ORDER_NOT_FOUND", "Pedido não encontrado", 404);
			res.json({ success: true, data: order, error: null });
		} catch (error) {
			next(error);
		}
	}

	async createOrder(req, res, next) {
		try {
			const items: Array<{
				product_id: number;
				name: string;
				quantity: number;
				unit_price: number;
				subtotal: number;
			}> = [];
			let total = 0;
			for (const item of req.body.items) {
				const product = (await this.productRepository.getProductById(item.product_id)) as ProductResDTO | null;
				if (!product) throw this.error("PRODUCT_NOT_FOUND", `Produto ${item.product_id} não encontrado`, 404);
				if (!product.available)
					throw this.error("PRODUCT_UNAVAILABLE", `Produto ${product.name} não está disponível`, 409);
				const subtotal = product.base_price * item.quantity;
				total += subtotal;
				items.push({
					product_id: product.id,
					name: product.name,
					quantity: item.quantity,
					unit_price: product.base_price,
					subtotal,
				});
			}
			const order = await this.orderRepository.create({
				user_id: req.user.id,
				items,
				total,
				status: "PENDING",
			} as Partial<OrderResDTO>);
			res.status(201).json({ success: true, data: order, error: null });
		} catch (error) {
			next(error);
		}
	}

	private publicUser(user) {
		return {
			id: user.id,
			name: user.name,
			email: user.email,
			last_login: user.last_login,
			created_at: user.created_at,
			updated_at: user.updated_at,
		};
	}
	private error(code: string, message: string, statusCode: number) {
		return Object.assign(new Error(message), { code, statusCode });
	}
}
