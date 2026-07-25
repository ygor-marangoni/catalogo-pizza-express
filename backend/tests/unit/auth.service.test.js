const assert = require("node:assert/strict");
const bcrypt = require("bcrypt");
const AuthService = require("../../dist/src/services/AuthService");

function account(id, email, passwordHash) {
	return {
		id,
		name: "Conta",
		email,
		password_hash: passwordHash,
		last_login: null,
		created_at: new Date(),
		updated_at: new Date(),
		deleted_at: null,
	};
}

test("AuthService autentica ADMIN e CUSTOMER pelo mesmo fluxo", async () => {
	const admin = account(1, "admin@example.com", await bcrypt.hash("admin-pass", 4));
	const customer = account(2, "customer@example.com", await bcrypt.hash("customer-pass", 4));
	const adminRepository = {
		findByEmail: async (email) => (email === admin.email ? admin : null),
		findById: async () => admin,
		updateLastLogin: async (id) => {
			admin.last_login = id;
		},
	};
	const userRepository = {
		findByEmail: async (email) => (email === customer.email ? customer : null),
		findById: async () => customer,
		updateLastLogin: async () => {},
		create: async () => customer,
		update: async () => customer,
	};
	const service = new AuthService(adminRepository, userRepository);

	assert.equal((await service.authenticate(admin.email, "admin-pass")).role, "ADMIN");
	assert.equal((await service.authenticate(customer.email, "customer-pass")).role, "CUSTOMER");
	await assert.rejects(() => service.authenticate("unknown@example.com", "wrong-pass"), {
		message: "INVALID_CREDENTIALS",
	});
});

test("AuthService impede cadastro com email existente", async () => {
	const existing = account(1, "existing@example.com", "hash");
	const repository = { findByEmail: async () => existing, create: async () => existing };
	const service = new AuthService({}, repository);
	await assert.rejects(
		() => service.registerUser({ name: "Cliente", email: existing.email, password: "senha-segura" }),
		{ message: "EMAIL_ALREADY_EXISTS" },
	);
});
