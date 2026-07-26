const ProductConfigurationService = require("../../dist/src/services/ProductConfigurationService");
const { InMemoryProductConfigurationRepository } = require("../../dist/src/repositories/InMemoryProductConfigurationRepository");
const { InMemoryRepository } = require("../../dist/src/repositories/InMemoryRepository");
const { productConfigurationSchema } = require("../../dist/src/validations/schemas");

describe("configuração comercial do produto", () => {
	it("persiste preço final por tamanho, padrão e exceções por produto", async () => {
		const products = new InMemoryRepository([{ id: 7, name: "Portuguesa", deleted_at: null }]);
		const service = new ProductConfigurationService(new InMemoryProductConfigurationRepository(), products);
		const configuration = {
			sizes: [
				{ size_id: 1, price: 3990, is_default: true, available: true },
				{ size_id: 2, price: 5990, is_default: false, available: true },
			],
			edges: [{ edge_id: 3, price_override: null, available: true }],
			additionals: [{ additional_id: 4, price_override: 850, available: true }],
		};

		const saved = await service.updateProductConfiguration(7, configuration);

		expect(saved).toEqual({ product_id: 7, ...configuration });
		expect(await service.getProductConfiguration(7)).toEqual(saved);
	});

	it("exige exatamente um tamanho padrão e disponível", () => {
		const invalid = {
			sizes: [
				{ size_id: 1, price: 3990, is_default: false, available: true },
				{ size_id: 2, price: 5990, is_default: false, available: true },
			],
			edges: [],
			additionals: [],
		};
		expect(productConfigurationSchema.safeParse(invalid).success).toBe(false);
		expect(productConfigurationSchema.safeParse({
			...invalid,
			sizes: [{ size_id: 1, price: 3990, is_default: true, available: false }],
		}).success).toBe(false);
	});

	it("recusa produto inexistente", async () => {
		const service = new ProductConfigurationService(
			new InMemoryProductConfigurationRepository(),
			new InMemoryRepository(),
		);
		await expect(service.getProductConfiguration(999)).rejects.toMatchObject({
			code: "PRODUCT_NOT_FOUND",
			statusCode: 404,
		});
	});
});
