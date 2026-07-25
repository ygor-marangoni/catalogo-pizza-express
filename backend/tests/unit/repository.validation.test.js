const assert = require("node:assert/strict");
const { InMemoryRepository } = require("../../dist/src/repositories/InMemoryRepository");

test("impede registros ativos duplicados", async () => {
	const repository = new InMemoryRepository();
	await repository.create({ name: "Categoria" });
	await assert.rejects(() => repository.create({ name: "categoria" }), (error) => error.code === "DUPLICATE_RESOURCE");
});

test("retorna erro ao excluir registro inexistente", async () => {
	const repository = new InMemoryRepository();
	await assert.rejects(() => repository.delete(999), (error) => error.code === "RESOURCE_NOT_FOUND");
});
