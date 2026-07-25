class ProductService {
	constructor(productRepository) {
		this.productRepository = productRepository;
	}

	async getAllProducts(filters = {}) {
		try {
			const products = await this.productRepository.findAll(filters);
			return products;
		} catch (error) {
			throw new Error(`Erro ao buscar produtos: ${error.message}`);
		}
	}

	async getProductById(id) {
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

	async createProduct(productData) {
		try {
			const product = await this.productRepository.create(productData);
			return product;
		} catch (error) {
			throw new Error(`Erro ao criar produto: ${error.message}`);
		}
	}

	async updateProduct(id, productData) {
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

	async deleteProduct(id) {
		try {
			await this.productRepository.delete(id);
			return { success: true };
		} catch (error) {
			throw new Error(`Erro ao deletar produto: ${error.message}`);
		}
	}
}

module.exports = ProductService;