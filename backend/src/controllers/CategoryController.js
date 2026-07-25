class CategoryController {
	constructor(categoryService) {
		this.categoryService = categoryService;
	}

	async findAll(req, res, next) {
		try {
			const categories = await this.categoryService.getAllCategories();

			res.json({
				success: true,
				data: categories,
				error: null,
			});
		} catch (error) {
			next(error);
		}
	}

	async findById(req, res, next) {
		try {
			const { id } = req.params;
			const category = await this.categoryService.getCategoryById(id);

			res.json({
				success: true,
				data: category,
				error: null,
			});
		} catch (error) {
			next(error);
		}
	}

	async create(req, res, next) {
		try {
			const categoryData = req.body;
			const category =
				await this.categoryService.createCategory(categoryData);

			res.status(201).json({
				success: true,
				data: category,
				error: null,
			});
		} catch (error) {
			next(error);
		}
	}

	async update(req, res, next) {
		try {
			const { id } = req.params;
			const categoryData = req.body;
			const category = await this.categoryService.updateCategory(
				id,
				categoryData,
			);

			res.json({
				success: true,
				data: category,
				error: null,
			});
		} catch (error) {
			next(error);
		}
	}

	async delete(req, res, next) {
		try {
			const { id } = req.params;
			await this.categoryService.deleteCategory(id);

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

module.exports = CategoryController;