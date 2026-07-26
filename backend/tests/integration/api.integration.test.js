const assert = require("node:assert/strict");
const { startServer, stopServer, request, jsonOptions, multipartOptions } = require("../support/http");
const { registerCustomer, login, loginAdmin } = require("../support/auth");

test("cobre os endpoints públicos, de autenticação, catálogo e loja", { concurrency: false }, async () => {
	const { server, baseUrl } = await startServer();
	try {
		for (const path of [
			"/",
			"/health",
			"/api-docs/openapi.json",
			"/api/v1/categories",
			"/api/v1/products",
			"/api/v1/additionals",
			"/api/v1/edges",
			"/api/v1/sizes",
			"/api/v1/store",
			"/api/v1/store/status",
		]) {
			const result = await request(baseUrl, path);
			assert.ok(
				result.response.status >= 200 && result.response.status < 300,
				`${path} retornou ${result.response.status}`,
			);
		}

		const search = await request(baseUrl, "/api/v1/products/search?q=pizza");
		assert.ok([200, 503].includes(search.response.status));

		const invalidLogin = await request(
			baseUrl,
			"/api/v1/auth/login",
			jsonOptions("POST", { email: "invalido", password: "" }),
		);
		assert.equal(invalidLogin.response.status, 400);

		const customerRegistration = await registerCustomer(baseUrl, `public-${Date.now()}`);
		assert.equal(customerRegistration.response.status, 201);
		const customerLogin = await login(baseUrl, customerRegistration.credentials);
		assert.equal(customerLogin.response.status, 200);
		assert.equal(customerLogin.role, "CUSTOMER");

		const customerRefresh = await request(baseUrl, "/api/v1/auth/refresh", { method: "POST" });
		assert.equal(customerRefresh.response.status, 401);

		const adminLogin = await loginAdmin(baseUrl);
		assert.equal(adminLogin.response.status, 200);
		assert.equal(adminLogin.role, "ADMIN");
		const me = await request(baseUrl, "/api/v1/auth/me", jsonOptions("GET", undefined, adminLogin.token));
		assert.equal(me.response.status, 200);
		assert.deepEqual(Object.keys(me.body.data).sort(), ["email", "id", "name", "role"]);
		assert.equal(me.body.data.role, "ADMIN");
		const logout = await request(baseUrl, "/api/v1/auth/logout", { method: "POST" });
		assert.equal(logout.response.status, 200);
		assert.match(logout.response.headers.get("set-cookie"), /refresh_token=;/);

		const notFound = await request(baseUrl, "/rota-inexistente");
		assert.equal(notFound.response.status, 404);
	} finally {
		await stopServer(server);
	}
});

test("cobre o CRUD administrativo de categorias, produtos e complementos", { concurrency: false }, async () => {
	const { server, baseUrl } = await startServer();
	try {
		const admin = await loginAdmin(baseUrl);
		assert.equal(admin.response.status, 200);
		const headers = (method, body) => jsonOptions(method, body, admin.token);

		const category = await request(baseUrl, "/api/v1/categories", headers("POST", { name: "Pizzas" }));
		assert.equal(category.response.status, 201);
		const categoryId = category.body.data.id;
		assert.equal((await request(baseUrl, `/api/v1/categories/${categoryId}`)).response.status, 200);
		assert.equal(
			(await request(baseUrl, `/api/v1/categories/${categoryId}`, headers("PUT", { name: "Pizzas especiais" })))
				.response.status,
			200,
		);

		const product = await request(
			baseUrl,
			"/api/v1/products",
			multipartOptions(
				"POST",
				{ name: "Margherita", category_id: categoryId, base_price: 2500, available: true },
				admin.token,
				{ name: "pizza.png", type: "image/png", content: "imagem de teste" },
			),
		);
		assert.equal(product.response.status, 201);
		const productId = product.body.data.id;
		assert.match(product.body.data.image_url, /^data:image\/png;base64,/);
		assert.equal((await request(baseUrl, `/api/v1/products/${productId}`)).response.status, 200);
		assert.equal(
			(await request(baseUrl, `/api/v1/products/${productId}`, headers("PUT", { name: "Margherita Especial" })))
				.response.status,
			200,
		);
		for (const resource of [
			["additionals", { name: "Azeitona", price: 300 }],
			["edges", { name: "Catupiry", additional_price: 500 }],
			["sizes", { name: "Grande", code: `G-${Date.now()}`, additional_price: 0 }],
		]) {
			const created = await request(baseUrl, `/api/v1/${resource[0]}`, headers("POST", resource[1]));
			assert.equal(created.response.status, 201);
			const id = created.body.data.id;
			assert.equal((await request(baseUrl, `/api/v1/${resource[0]}/${id}`)).response.status, 200);
			assert.equal(
				(
					await request(
						baseUrl,
						`/api/v1/${resource[0]}/${id}`,
						headers("PUT", { name: `${resource[1].name} atualizado` }),
					)
				).response.status,
				200,
			);
			assert.equal(
				(await request(baseUrl, `/api/v1/${resource[0]}/${id}`, headers("DELETE"))).response.status,
				200,
			);
		}

		assert.equal((await request(baseUrl, `/api/v1/products/${productId}`, headers("DELETE"))).response.status, 200);
		assert.equal(
			(await request(baseUrl, `/api/v1/categories/${categoryId}`, headers("DELETE"))).response.status,
			200,
		);
	} finally {
		await stopServer(server);
	}
});
