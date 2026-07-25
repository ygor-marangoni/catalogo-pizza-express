class ProductController {
	constructor(productService) {
		this.productService = productService;
	}

	async findAll(req, res, next) {
		try {
			const filters = req.query;
			const products = await this.productService.getAllProducts(filters);

			res.json({
				success: true,
				data: products,
				error: null,
			});
		} catch (error) {
			next(error);
		}
	}

	async findById(req, res, next) {
		try {
			const { id } = req.params;
			const product = await this.productService.getProductById(id);

			res.json({
				success: true,
				data: product,
				error: null,
			});
		} catch (error) {
			next(error);
		}
	}

	async create(req, res, next) {
		try {
			const productData = req.body;
			const product =
				await this.productService.createProduct(productData);

			res.status(201).json({
				success: true,
				data: product,
				error: null,
			});
		} catch (error) {
			next(error);
		}
	}

	async update(req, res, next) {
		try {
			const { id } = req.params;
			const productData = req.body;
			const product = await this.productService.updateProduct(
				id,
				productData,
			);

			res.json({
				success: true,
				data: product,
				error: null,
			});
		} catch (error) {
			next(error);
		}
	}

	async delete(req, res, next) {
		try {
			const { id } = req.params;
			await this.productService.deleteProduct(id);

			res.json({
				success: true,
				data: null,
				error: null,
			});
		} catch (error) {
			next(error);
		}
	}
}

module.exports = ProductController;