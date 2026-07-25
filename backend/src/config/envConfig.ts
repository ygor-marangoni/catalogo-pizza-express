require("dotenv").config();

export const envConfig = {
	NODE_ENV: process.env.NODE_ENV || "development",
	PORT: Number(process.env.PORT || 3000),
	DB_HOST: process.env.DB_HOST || "localhost",
	DB_PORT: Number(process.env.DB_PORT || 5432),
	DB_USER: process.env.DB_USER || "postgres",
	DB_PASSWORD: process.env.DB_PASSWORD || "password",
	DB_NAME: process.env.DB_NAME || "db_pizza_express_dev",
	USE_DATABASE: process.env.USE_DATABASE === "true",
	JWT_SECRET: process.env.JWT_SECRET || "pizza-express-secret-key",
	JWT_EXPIRATION: process.env.JWT_EXPIRATION || "24h",
	CORS_ORIGIN: process.env.CORS_ORIGIN || "http://localhost:3000",
	RATE_LIMIT_WINDOW_MS: Number(process.env.RATE_LIMIT_WINDOW_MS || 900000),
	RATE_LIMIT_MAX_REQUESTS: Number(process.env.RATE_LIMIT_MAX_REQUESTS || 5),
};

if (envConfig.NODE_ENV === "production" && envConfig.JWT_SECRET === "pizza-express-secret-key")
	throw new Error("JWT_SECRET deve ser configurado em produção");
