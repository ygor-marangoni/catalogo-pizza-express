import { ErrorCode } from "../entities/enums";
import type { CreateCategoryReqDTO, UpdateCategoryReqDTO } from "../dtos/req";
import type { CategoryResDTO, Repository } from "../dtos/res";

class CategoryService {
	private readonly categoryRepository: Repository<CategoryResDTO, CreateCategoryReqDTO, UpdateCategoryReqDTO>;

	constructor(categoryRepository: Repository<CategoryResDTO, CreateCategoryReqDTO, UpdateCategoryReqDTO>) {
		this.categoryRepository = categoryRepository;
	}

	async getAllCategories(): Promise<CategoryResDTO[]> {
		try {
			const categories = await this.categoryRepository.findAll();
			return categories;
		} catch (error) {
			throw new Error(`Erro ao buscar categorias: ${error.message}`);
		}
	}

	async getCategoryById(id: number): Promise<CategoryResDTO> {
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

	async createCategory(categoryData: CreateCategoryReqDTO): Promise<CategoryResDTO> {
		try {
			const category = await this.categoryRepository.create(categoryData);
			return category;
		} catch (error) {
			throw new Error(`Erro ao criar categoria: ${error.message}`);
		}
	}

	async updateCategory(id: number, categoryData: UpdateCategoryReqDTO): Promise<CategoryResDTO> {
		try {
			const category = await this.categoryRepository.update(id, categoryData);
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
