class CategoryService {
	constructor(categoryRepository) {
		this.categoryRepository = categoryRepository;
	}

	async getAllCategories() {
		try {
			const categories = await this.categoryRepository.findAll();
			return categories;
		} catch (error) {
			throw new Error(`Erro ao buscar categorias: ${error.message}`);
		}
	}

	async getCategoryById(id) {
		try {
			const category = await this.categoryRepository.findById(id);
			if (!category) {
				throw new Error("CATEGORY_NOT_FOUND");
			}
			return category;
		} catch (error) {
			throw error;
		}
	}

	async createCategory(categoryData) {
		try {
			const category = await this.categoryRepository.create(categoryData);
			return category;
		} catch (error) {
			throw new Error(`Erro ao criar categoria: ${error.message}`);
		}
	}

	async updateCategory(id, categoryData) {
		try {
			const category = await this.categoryRepository.update(
				id,
				categoryData,
			);
			return category;
		} catch (error) {
			throw new Error(`Erro ao atualizar categoria: ${error.message}`);
		}
	}

	async deleteCategory(id) {
		try {
			await this.categoryRepository.delete(id);
			return { success: true };
		} catch (error) {
			throw new Error(`Erro ao deletar categoria: ${error.message}`);
		}
	}
}

module.exports = CategoryService;