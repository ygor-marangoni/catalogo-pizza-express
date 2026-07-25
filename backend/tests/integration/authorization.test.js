const assert = require("node:assert/strict");
const http = require("node:http");

test("o login unificado identifica CUSTOMER e bloqueia operações administrativas", { concurrency: false }, async () => {
	process.env.USE_DATABASE = "false";
	const app = require("../../dist/server");
	const server = http.createServer(app);
	await new Promise((resolve) => server.listen(0, resolve));
	const address = server.address();
	const baseUrl = `http://127.0.0.1:${address.port}`;
	const email = `customer-${Date.now()}@example.com`;

	try {
		const registerResponse = await fetch(`${baseUrl}/api/v1/auth/user/register`, {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({
				name: "Cliente Teste",
				email,
				password: "senha-segura",
			}),
		});
		assert.equal(registerResponse.status, 201);

		const loginResponse = await fetch(`${baseUrl}/api/v1/auth/login`, {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({ email, password: "senha-segura" }),
		});
		const loginBody = await loginResponse.json();
		assert.equal(loginResponse.status, 200);
		assert.equal(loginBody.data.role, "CUSTOMER");

		const catalogResponse = await fetch(`${baseUrl}/api/v1/categories`, {
			method: "POST",
			headers: {
				"content-type": "application/json",
				authorization: `Bearer ${loginBody.data.token}`,
			},
			body: JSON.stringify({ name: "Não permitido" }),
		});
		assert.equal(catalogResponse.status, 403);
	} finally {
		await new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
	}
});
