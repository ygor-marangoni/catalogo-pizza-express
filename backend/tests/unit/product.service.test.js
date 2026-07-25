const assert = require("node:assert/strict");
const ProductService = require("../../dist/src/services/ProductService");

test("ProductService delega operações ao repositório", async () => {
	const product = { id: 1, name: "Margherita" };
	const calls = [];
	const repository = {
		findAll: async (filters) => {
			calls.push(["findAll", filters]);
			return [product];
		},
		findById: async (id) => {
			calls.push(["findById", id]);
			return id === 1 ? product : null;
		},
		create: async (data) => {
			calls.push(["create", data]);
			return product;
		},
		update: async (id, data) => {
			calls.push(["update", id, data]);
			return product;
		},
		delete: async (id) => {
			calls.push(["delete", id]);
		},
	};
	const service = new ProductService(repository);

	assert.deepEqual(await service.getAllProducts({ available: true }), [product]);
	assert.equal((await service.getProductById(1)).id, 1);
	assert.equal((await service.createProduct({ name: "Margherita", category_id: 1, base_price: 2500 })).id, 1);
	assert.equal((await service.updateProduct(1, { name: "Especial" })).id, 1);
	assert.deepEqual(await service.deleteProduct(1), { success: true });
	assert.deepEqual(
		calls.map(([name]) => name),
		["findAll", "findById", "create", "update", "delete"],
	);
});

test("ProductService retorna erro para produto inexistente", async () => {
	const service = new ProductService({ findById: async () => null });
	await assert.rejects(() => service.getProductById(99), { message: "PRODUCT_NOT_FOUND" });
});
