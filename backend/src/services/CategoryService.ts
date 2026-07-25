import { ErrorCode } from "../enums";
import type { CategoryInput, CategoryResource, Repository } from "../types/domain";

class CategoryService {
	private readonly categoryRepository: Repository<CategoryResource, CategoryInput, Partial<CategoryInput>>;

	constructor(categoryRepository: Repository<CategoryResource, CategoryInput, Partial<CategoryInput>>) {
		this.categoryRepository = categoryRepository;
	}

	async getAllCategories(): Promise<CategoryResource[]> {
		try {
			const categories = await this.categoryRepository.findAll();
			return categories;
		} catch (error) {
			throw new Error(`Erro ao buscar categorias: ${error.message}`);
		}
	}

	async getCategoryById(id: number): Promise<CategoryResource> {
		try {
			const category = await this.categoryRepository.findById(id);
			if (!category) {
				throw new Error(ErrorCode.CATEGORY_NOT_FOUND);
			}
			return category;
		} catch (error) {
			throw error;
		}
	}

	async createCategory(categoryData: CategoryInput): Promise<CategoryResource> {
		try {
			const category = await this.categoryRepository.create(categoryData);
			return category;
		} catch (error) {
			throw new Error(`Erro ao criar categoria: ${error.message}`);
		}
	}

	async updateCategory(id: number, categoryData: Partial<CategoryInput>): Promise<CategoryResource> {
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

	async deleteCategory(id: number): Promise<{ success: true }> {
		try {
			await this.categoryRepository.delete(id);
			return { success: true };
		} catch (error) {
			throw new Error(`Erro ao deletar categoria: ${error.message}`);
		}
	}
}

export = CategoryService;
