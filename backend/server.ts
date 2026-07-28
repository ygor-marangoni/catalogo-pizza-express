const express = require("express");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
require("dotenv").config();
require("./src/config/envConfig");
const path = require("path");
const swaggerUi = require("swagger-ui-express");

const authRoutes = require("./src/routes/authRoutes");
const categoryRoutes = require("./src/routes/categoryRoutes");
const productRoutes = require("./src/routes/productRoutes");
const storeRoutes = require("./src/routes/storeRoutes");
const additionalRoutes = require("./src/routes/additionalRoutes");
const edgeRoutes = require("./src/routes/edgeRoutes");
const sizeRoutes = require("./src/routes/sizeRoutes");
const userRoutes = require("./src/routes/userRoutes");
const adminOrderRoutes = require("./src/routes/adminOrderRoutes");
const adminCustomerRoutes = require("./src/routes/adminCustomerRoutes");
const couponRoutes = require("./src/routes/couponRoutes");
const ErrorHandler = require("./src/middlewares/ErrorHandler");
const swaggerSpec = require("./src/config/openApiConfig");
const { concurrencyLimit } = require("./src/middlewares/ConcurrencyMiddleware");

const app = express();
// Configura a aplicação HTTP e registra as rotas principais.
const port = Number.parseInt(process.env.PORT ?? "", 10) || 3000;
const apiPrefix = "/api/v1";
const loginLimiter = rateLimit({
	windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 900000),
	limit: Number(process.env.RATE_LIMIT_MAX_REQUESTS || 5),
	standardHeaders: true,
	legacyHeaders: false,
});
// Limita concorrência e tentativas de autenticação antes das rotas.

app.disable("x-powered-by");
app.use(compression());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(
	concurrencyLimit(
		Number(process.env.MAX_CONCURRENT_REQUESTS || 100),
		Number(process.env.MAX_WAITING_REQUESTS || 200),
	),
);

const corsOrigins = (process.env.CORS_ORIGIN || "http://localhost:3000,http://127.0.0.1:3000")
	.split(",")
	.map((origin) => origin.trim())
	.filter(Boolean);

app.use((req, res, next) => {
	const requestOrigin = req.headers.origin;
	const allowedOrigin = requestOrigin && corsOrigins.includes(requestOrigin) ? requestOrigin : null;

	if (allowedOrigin) res.header("Access-Control-Allow-Origin", allowedOrigin);

	res.header("Vary", "Origin");
	res.header("Access-Control-Allow-Credentials", "true");
	res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
	res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
	res.header("Access-Control-Allow-Private-Network", "true");

	if (req.method === "OPTIONS") {
		return res.sendStatus(204);
	}

	next();
});

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
	res.json({
		name: "Pizza Express API",
		status: "ok",
		version: "v1",
	});
});

app.get("/health", (req, res) => {
	res.json({ success: true, data: { status: "healthy" }, error: null });
});

app.get("/api-docs/openapi.json", (req, res) => {
	res.json(swaggerSpec);
});

app.use(
	"/api-docs",
	swaggerUi.serve,
	swaggerUi.setup(swaggerSpec, {
		customSiteTitle: "Pizza Express API - Swagger",
		customCss: ".swagger-ui .topbar { display: none }",
	}),
);

app.use(`${apiPrefix}/auth/login`, loginLimiter);
app.use(`${apiPrefix}/auth/user/register`, loginLimiter);
app.use(`${apiPrefix}/auth`, authRoutes);
app.use(`${apiPrefix}/users`, userRoutes);
app.use(`${apiPrefix}/admin/orders`, adminOrderRoutes);
app.use(`${apiPrefix}/admin/customers`, adminCustomerRoutes);
app.use(`${apiPrefix}/categories`, categoryRoutes);
app.use(`${apiPrefix}/products`, productRoutes);
app.use(`${apiPrefix}/store`, storeRoutes);
app.use(`${apiPrefix}/additionals`, additionalRoutes);
app.use(`${apiPrefix}/edges`, edgeRoutes);
app.use(`${apiPrefix}/sizes`, sizeRoutes);
app.use(`${apiPrefix}/coupons`, couponRoutes);

app.use((req, res) => {
	res.status(404).json({
		success: false,
		data: null,
		error: {
			code: "ROUTE_NOT_FOUND",
			message: "Rota não encontrada",
			field: null,
		},
	});
});

app.use(ErrorHandler.handle);

if (require.main === module) {
	const start = async () => {
		if (process.env.USE_DATABASE === "true") await require("./src/config/ormConfig").initializeDatabase();
		app.listen(port, () => console.log(`Pizza Express API rodando na porta ${port}`));
	};
	start().catch((error) => {
		console.error(error);
		process.exit(1);
	});
}

module.exports = app;
