const assert = require("node:assert/strict");
const { loginSchema, orderSchema, productCreateSchema } = require("../../dist/src/validations/schemas");

test("schemas Zod aceitam dados válidos", () => {
	assert.equal(loginSchema.safeParse({ email: "cliente@example.com", password: "senha" }).success, true);
	assert.equal(orderSchema.safeParse({ items: [{ product_id: 1, quantity: 2 }] }).success, true);
	assert.equal(productCreateSchema.safeParse({ name: "Pizza", category_id: 1, base_price: 2500 }).success, true);
});

test("schemas Zod rejeitam dados inválidos e campos extras", () => {
	assert.equal(loginSchema.safeParse({ email: "invalido", password: "senha" }).success, false);
	assert.equal(orderSchema.safeParse({ items: [], total: 100 }).success, false);
	assert.equal(
		productCreateSchema.safeParse({ name: "Pizza", category_id: 1, base_price: 2500, unknown: true }).success,
		false,
	);
});
