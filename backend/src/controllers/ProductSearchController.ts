import { ErrorCode } from "../entities/enums";
const AppError = require("../exceptions/AppError");

class ProductSearchController {
	constructor(private readonly searchService: any) {}

	async search(req, res, next) {
		try {
			const query = typeof req.query.q === "string" ? req.query.q : "";
			const products = await this.searchService.search(query, {
				category_id: req.query.category_id ? Number(req.query.category_id) : undefined,
				available: req.query.available === undefined ? undefined : req.query.available === "true",
			});
			res.json({ success: true, data: { items: products }, error: null });
		} catch (error) {
			next(new AppError("Serviço de busca temporariamente indisponível", ErrorCode.PRODUCT_SEARCH_UNAVAILABLE, 503));
		}
	}
}

module.exports = ProductSearchController;
