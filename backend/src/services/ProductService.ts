import type { ProductInput, ProductResource, Repository } from "../types/domain";

class ProductService {
	private readonly productRepository: Repository<ProductResource, ProductInput, Partial<ProductInput>>;

	constructor(productRepository: Repository<ProductResource, ProductInput, Partial<ProductInput>>) {
		this.productRepository = productRepository;
	}

	async getAllProducts(filters: Record<string, unknown> = {}): Promise<ProductResource[]> {
		try {
			const products = await this.productRepository.findAll(filters);
			return products;
		} catch (error) {
			throw new Error(`Erro ao buscar produtos: ${error.message}`);
		}
	}

	async getProductById(id: number): Promise<ProductResource> {
		try {
			const product = await this.productRepository.findById(id);
			if (!product) {
				throw new Error("PRODUCT_NOT_FOUND");
			}
			return product;
		} catch (error) {
			throw error;
		}
	}

	async createProduct(productData: ProductInput): Promise<ProductResource> {
		try {
			const product = await this.productRepository.create(productData);
			return product;
		} catch (error) {
			throw new Error(`Erro ao criar produto: ${error.message}`);
		}
	}

	async updateProduct(id: number, productData: Partial<ProductInput>): Promise<ProductResource> {
		try {
			const product = await this.productRepository.update(
				id,
				productData,
			);
			return product;
		} catch (error) {
			throw new Error(`Erro ao atualizar produto: ${error.message}`);
		}
	}

	async deleteProduct(id: number): Promise<{ success: true }> {
		try {
			await this.productRepository.delete(id);
			return { success: true };
		} catch (error) {
			throw new Error(`Erro ao deletar produto: ${error.message}`);
		}
	}
}

export = ProductService;
