const Logger = require("../utils/Logger");
import { parseResourceId } from "../utils/ResourceId";

class ProductImageController {
	constructor(
		private readonly productService: any,
		private readonly imageService: any,
	) {}

	async upload(req, res, next) {
		try {
			const imageUrl = await this.imageService.upload(req.body.image_url || req.body.data);
			const product = await this.productService.updateProduct(parseResourceId(req.params.id), { image_url: imageUrl });
			Logger.info("Imagem de produto atualizada", {
				productId: product.id,
				adminId: req.user?.id,
			});
			res.json({ success: true, data: product, error: null });
		} catch (error) {
			next(error);
		}
	}
}

module.exports = ProductImageController;
