const assert = require("node:assert/strict");
const { startServer, stopServer, request, jsonOptions } = require("../support/http");
const { registerCustomer, login, loginAdmin } = require("../support/auth");

test(
	"cobre perfil, favoritos, pedidos do CUSTOMER e gestão administrativa de pedidos",
	{ concurrency: false },
	async () => {
		const { server, baseUrl } = await startServer();
		try {
			const admin = await loginAdmin(baseUrl);
			const adminOptions = (method, body) => jsonOptions(method, body, admin.token);
			const category = await request(baseUrl, "/api/v1/categories", adminOptions("POST", { name: "Clientes" }));
			const product = await request(
				baseUrl,
				"/api/v1/products",
				adminOptions("POST", {
					name: "Pizza Cliente",
					category_id: category.body.data.id,
					base_price: 3000,
					available: true,
				}),
			);
			const productId = product.body.data.id;

			const registration = await registerCustomer(baseUrl, `customer-${Date.now()}`);
			const customer = await login(baseUrl, registration.credentials);
			const customerOptions = (method, body) => jsonOptions(method, body, customer.token);

			const profile = await request(baseUrl, "/api/v1/users/me");
			assert.equal(profile.response.status, 401);
			assert.equal((await request(baseUrl, "/api/v1/users/me", customerOptions("GET"))).response.status, 200);
			assert.equal(
				(await request(baseUrl, "/api/v1/users/me", customerOptions("PUT", { name: "Cliente Atualizado" })))
					.response.status,
				200,
			);

			const favorite = await request(
				baseUrl,
				"/api/v1/users/me/favorites",
				customerOptions("POST", { product_id: productId }),
			);
			assert.equal(favorite.response.status, 201);
			assert.equal(
				(await request(baseUrl, "/api/v1/users/me/favorites", customerOptions("GET"))).response.status,
				200,
			);
			assert.equal(
				(
					await request(
						baseUrl,
						"/api/v1/users/me/favorites",
						customerOptions("POST", { product_id: productId }),
					)
				).response.status,
				409,
			);
			assert.equal(
				(
					await request(
						baseUrl,
						`/api/v1/users/me/favorites/${favorite.body.data.id}`,
						customerOptions("DELETE"),
					)
				).response.status,
				200,
			);

			const order = await request(
				baseUrl,
				"/api/v1/users/me/orders",
				customerOptions("POST", { items: [{ product_id: productId, quantity: 2 }] }),
			);
			assert.equal(order.response.status, 201);
			assert.equal(order.body.data.total, 6000);
			assert.equal(
				(await request(baseUrl, "/api/v1/users/me/orders", customerOptions("GET"))).response.status,
				200,
			);
			assert.equal(
				(await request(baseUrl, `/api/v1/users/me/orders/${order.body.data.id}`, customerOptions("GET")))
					.response.status,
				200,
			);

			assert.equal((await request(baseUrl, "/api/v1/admin/orders", adminOptions("GET"))).response.status, 200);
			assert.equal(
				(
					await request(
						baseUrl,
						`/api/v1/admin/orders/${order.body.data.id}/status`,
						adminOptions("PATCH", { status: "PREPARING" }),
					)
				).response.status,
				200,
			);
			assert.equal(
				(
					await request(
						baseUrl,
						`/api/v1/admin/orders/${order.body.data.id}/status`,
						customerOptions("PATCH", { status: "DELIVERED" }),
					)
				).response.status,
				403,
			);

			assert.equal(
				(await request(baseUrl, "/api/v1/store", adminOptions("PUT", { name: "Pizza Express Centro" })))
					.response.status,
				200,
			);
			assert.equal(
				(await request(baseUrl, "/api/v1/store/status", adminOptions("PUT", { is_open: false }))).response
					.status,
				200,
			);
		} finally {
			await stopServer(server);
		}
	},
);
