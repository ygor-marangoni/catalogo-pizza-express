const express = require("express");
const path = require("path");
const swaggerUi = require("swagger-ui-express");

const authRoutes = require("./src/routes/authRoutes");
const categoryRoutes = require("./src/routes/categoryRoutes");
const productRoutes = require("./src/routes/productRoutes");
const storeRoutes = require("./src/routes/storeRoutes");
const ErrorHandler = require("./src/middlewares/ErrorHandler");
const swaggerSpec = require("./src/docs/openapi");

const app = express();
const port = Number.parseInt(process.env.PORT ?? "", 10) || 3000;
const apiPrefix = "/api/v1";

app.disable("x-powered-by");
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

const corsOrigin = process.env.CORS_ORIGIN || "http://localhost:3000";

app.use((req, res, next) => {
	const requestOrigin = req.headers.origin;

	if (corsOrigin === "*" || !requestOrigin || requestOrigin === corsOrigin) {
		res.header("Access-Control-Allow-Origin", corsOrigin);
	}

	res.header("Vary", "Origin");
	res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
	res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");

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

app.use(`${apiPrefix}/auth`, authRoutes);
app.use(`${apiPrefix}/categories`, categoryRoutes);
app.use(`${apiPrefix}/products`, productRoutes);
app.use(`${apiPrefix}/store`, storeRoutes);

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
	app.listen(port, () => {
		console.log(`Pizza Express API rodando na porta ${port}`);
	});
}

module.exports = app;
