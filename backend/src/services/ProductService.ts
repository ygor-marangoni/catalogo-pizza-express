import { ErrorCode } from "../entities/enums";
import type { CreateProductReqDTO, UpdateProductReqDTO } from "../dtos/req";
import type { ProductResDTO, Repository } from "../dtos/res";

class ProductService {
	private readonly productRepository: Repository<ProductResDTO, CreateProductReqDTO, UpdateProductReqDTO>;

	constructor(productRepository: Repository<ProductResDTO, CreateProductReqDTO, UpdateProductReqDTO>) {
		this.productRepository = productRepository;
	}

	async getAllProducts(filters: Record<string, unknown> = {}): Promise<ProductResDTO[]> {
		try {
			const products = await this.productRepository.findAll(filters);
			return products;
		} catch (error) {
			throw new Error(`Erro ao buscar produtos: ${error.message}`);
		}
	}

	async getProductById(id: number): Promise<ProductResDTO> {
		try {
			const product = await this.productRepository.findById(id);
			if (!product) {
				throw new Error(ErrorCode.PRODUCT_NOT_FOUND);
			}
			return product;
		} catch (error) {
			throw error;
		}
	}

	async createProduct(productData: CreateProductReqDTO): Promise<ProductResDTO> {
		try {
			const product = await this.productRepository.create(productData);
			return product;
		} catch (error) {
			throw new Error(`Erro ao criar produto: ${error.message}`);
		}
	}

	async updateProduct(id: number, productData: UpdateProductReqDTO): Promise<ProductResDTO> {
		try {
			const product = await this.productRepository.update(id, productData);
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
