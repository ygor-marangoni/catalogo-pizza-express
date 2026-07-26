export class InMemoryProductConfigurationRepository {
	private readonly records = new Map<number, any>();

	async findAll() {
		return [...this.records.values()];
	}

	async findByProductId(productId: number) {
		return this.records.get(productId) || { product_id: productId, sizes: [], edges: [], additionals: [] };
	}

	async save(productId: number, configuration: any) {
		const record = { product_id: productId, ...structuredClone(configuration) };
		this.records.set(productId, record);
		return record;
	}
}
