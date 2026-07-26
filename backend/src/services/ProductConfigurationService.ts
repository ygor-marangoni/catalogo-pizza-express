class ProductConfigurationService {
	constructor(private readonly repository: any, private readonly productRepository: any) {}

	getAllConfigurations() {
		return this.repository.findAll();
	}

	async getProductConfiguration(productId: number) {
		await this.ensureProduct(productId);
		return this.repository.findByProductId(productId);
	}

	async updateProductConfiguration(productId: number, configuration: any) {
		await this.ensureProduct(productId);
		return this.repository.save(productId, configuration);
	}

	private async ensureProduct(productId: number) {
		if (!Number.isInteger(productId) || productId <= 0 || !(await this.productRepository.findById(productId)))
			throw Object.assign(new Error("Produto não encontrado"), { statusCode: 404, code: "PRODUCT_NOT_FOUND" });
	}
}

export = ProductConfigurationService;
