import type { UpdateUserReqDTO } from "../dtos/req";
import type { FavoriteResDTO, OrderResDTO, ProductResDTO } from "../dtos/res";
import { parseResourceId } from "../utils/ResourceId";

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
			const favorite = await this.favoriteRepository.findById(parseResourceId(req.params.id));
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
			const order = await this.orderRepository.findById(parseResourceId(req.params.id));
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
				size?: unknown;
				edge?: unknown;
				additionals?: unknown[];
				note?: string;
			}> = [];
			let total = 0;
			for (const item of req.body.items) {
				const product = (await this.productRepository.getProductById(item.product_id)) as ProductResDTO | null;
				if (!product) throw this.error("PRODUCT_NOT_FOUND", `Produto ${item.product_id} não encontrado`, 404);
				if (!product.available)
					throw this.error("PRODUCT_UNAVAILABLE", `Produto ${product.name} não está disponível`, 409);
				const sizes: any[] = product.sizes || [];
				const edges: any[] = product.edges || [];
				const additionals: any[] = product.additionals || [];
				if (sizes.length && !item.size_id) throw this.error("SIZE_REQUIRED", `Escolha um tamanho para ${product.name}`, 400);
				const size = item.size_id ? sizes.find((option: any) => option.id === item.size_id) : null;
				if (item.size_id && !size) throw this.error("SIZE_NOT_ALLOWED", `Tamanho não permitido para ${product.name}`, 400);
				const edge = item.edge_id ? edges.find((option: any) => option.id === item.edge_id) : null;
				if (item.edge_id && !edge) throw this.error("EDGE_NOT_ALLOWED", `Borda não permitida para ${product.name}`, 400);
				const selectedAdditionalIds = [...new Set(item.additional_ids || [])];
				const selectedAdditionals = selectedAdditionalIds.map((id) => additionals.find((option: any) => option.id === id));
				if (selectedAdditionals.some((option) => !option)) throw this.error("ADDITIONAL_NOT_ALLOWED", `Adicional não permitido para ${product.name}`, 400);
				const unitPrice = product.base_price + (size?.additional_price || 0) + (edge?.additional_price || 0) + selectedAdditionals.reduce((sum, option: any) => sum + option.price, 0);
				const subtotal = unitPrice * item.quantity;
				total += subtotal;
				items.push({
					product_id: product.id,
					name: product.name,
					quantity: item.quantity,
					unit_price: unitPrice,
					subtotal,
					size: size ? { id: size.id, name: size.name, additional_price: size.additional_price } : null,
					edge: edge ? { id: edge.id, name: edge.name, additional_price: edge.additional_price } : null,
					additionals: selectedAdditionals.map((option: any) => ({ id: option.id, name: option.name, price: option.price })),
					note: typeof item.note === "string" ? item.note.trim().slice(0, 300) : "",
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
			created_at: user.created_at,
			updated_at: user.updated_at,
		};
	}
	private error(code: string, message: string, statusCode: number) {
		return Object.assign(new Error(message), { code, statusCode });
	}
}
