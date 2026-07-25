const { jsonOptions, request } = require("./http");

async function registerCustomer(baseUrl, suffix = Date.now()) {
	const credentials = { name: `Cliente ${suffix}`, email: `cliente-${suffix}@example.com`, password: "senha-segura" };
	const result = await request(baseUrl, "/api/v1/auth/user/register", jsonOptions("POST", credentials));
	return { ...result, credentials };
}

async function login(baseUrl, credentials) {
	const result = await request(
		baseUrl,
		"/api/v1/auth/login",
		jsonOptions("POST", { email: credentials.email, password: credentials.password }),
	);
	return { ...result, token: result.body?.data?.token, role: result.body?.data?.role };
}

async function loginAdmin(baseUrl) {
	return login(baseUrl, {
		email: process.env.ADMIN_EMAIL || "admin@pizzaexpress.com",
		password: process.env.ADMIN_PASSWORD || "senha",
	});
}

module.exports = { registerCustomer, login, loginAdmin };
