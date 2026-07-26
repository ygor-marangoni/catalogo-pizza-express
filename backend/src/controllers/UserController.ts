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
		private readonly productConfigurationService: any,
		private readonly couponService: any,
		private readonly storeService: any,
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

	async deleteProfile(req, res, next) {
		try {
			await this.authService.deleteUser(req.user.id);
			res.json({ success: true, data: null, error: null });
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
				size?: { id: number; name: string };
				edge?: { id: number; name: string; price: number };
				additionals?: Array<{ id: number; name: string; price: number }>;
				note?: string;
			}> = [];
			let subtotal = 0;
			for (const item of req.body.items) {
				const product = (await this.productRepository.getProductById(item.product_id)) as ProductResDTO | null;
				if (!product) throw this.error("PRODUCT_NOT_FOUND", `Produto ${item.product_id} não encontrado`, 404);
				if (!product.available)
					throw this.error("PRODUCT_UNAVAILABLE", `Produto ${product.name} não está disponível`, 409);
				const configuration = await this.productConfigurationService.getProductConfiguration(product.id);
				const availableSizes = configuration.sizes.filter((option) => option.available);
				const size = availableSizes.length
					? availableSizes.find((option) => option.size_id === item.size_id) ||
						(!item.size_id ? availableSizes.find((option) => option.is_default) : null)
					: null;
				if (availableSizes.length && !size)
					throw this.error("VALIDATION_ERROR", `Selecione um tamanho válido para ${product.name}`, 400);
				const edge = item.edge_id
					? configuration.edges.find((option) => option.edge_id === item.edge_id && option.available)
					: null;
				if (item.edge_id && !edge)
					throw this.error("VALIDATION_ERROR", `A borda selecionada não está disponível para ${product.name}`, 400);
				const requestedAdditionalIds = [...new Set<number>(item.additional_ids || [])];
				const additionals = requestedAdditionalIds.map((id) =>
					configuration.additionals.find((option) => option.additional_id === id && option.available),
				);
				if (additionals.some((option) => !option))
					throw this.error("VALIDATION_ERROR", `Existe adicional indisponível para ${product.name}`, 400);
				const unitPrice =
					(size?.price ?? product.base_price) +
					(edge?.price ?? 0) +
					additionals.reduce((sum, option) => sum + option.price, 0);
				const itemSubtotal = unitPrice * item.quantity;
				subtotal += itemSubtotal;
				items.push({
					product_id: product.id,
					name: product.name,
					quantity: item.quantity,
					unit_price: unitPrice,
					subtotal: itemSubtotal,
					...(size ? { size: { id: size.size_id, name: size.name } } : {}),
					...(edge ? { edge: { id: edge.edge_id, name: edge.name, price: edge.price } } : {}),
					...(additionals.length
						? { additionals: additionals.map((option) => ({ id: option.additional_id, name: option.name, price: option.price })) }
						: {}),
					...(item.note ? { note: item.note } : {}),
				});
			}
			const coupon = req.body.coupon_code
				? await this.couponService.validate(req.body.coupon_code, subtotal)
				: null;
			const store = await this.storeService.getStoreInfo();
			const deliveryFee = req.body.customer?.fulfillment === "delivery" ? store.delivery_fee : 0;
			const discount = coupon?.discount_in_cents || 0;
			const total = Math.max(0, subtotal - discount) + deliveryFee;
			const order = await this.orderRepository.create({
				user_id: req.user.id,
				items,
				total,
				status: "PENDING",
				fulfillment: req.body.customer?.fulfillment || null,
				phone: req.body.customer?.phone || null,
				address: req.body.customer?.address || null,
				payment: req.body.customer?.payment || null,
				notes: req.body.customer?.notes || null,
				delivery_fee: deliveryFee,
				discount,
				coupon_code: coupon?.code || null,
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
