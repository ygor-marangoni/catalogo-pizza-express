require("dotenv").config();

const config = {
	// Servidor
	NODE_ENV: process.env.NODE_ENV || "development",
	PORT: process.env.PORT || 3000,

	// Banco de Dados
	DB_HOST: process.env.DB_HOST || "localhost",
	DB_PORT: process.env.DB_PORT || 5432,
	DB_USER: process.env.DB_USER || "postgres",
	DB_PASSWORD: process.env.DB_PASSWORD || "password",
	DB_NAME: process.env.DB_NAME || "db_pizza_express_dev",

	// JWT
	JWT_SECRET: process.env.JWT_SECRET || "pizza-express-secret-key",
	JWT_EXPIRATION: process.env.JWT_EXPIRATION || "24h",

	// Cloudinary
	CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
	CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
	CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,

	// CORS
	CORS_ORIGIN: process.env.CORS_ORIGIN || "http://localhost:3000",

	// Rate Limit
	RATE_LIMIT_WINDOW_MS: process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000, // 15 minutos
	RATE_LIMIT_MAX_REQUESTS: process.env.RATE_LIMIT_MAX_REQUESTS || 5, // 5 requisições
};

// Validar configurações críticas
const validateConfig = () => {
	if (
		!config.JWT_SECRET ||
		config.JWT_SECRET === "pizza-express-secret-key"
	) {
		console.warn(
			"⚠️  JWT_SECRET não está configurado. Use um valor seguro em produção!",
		);
	}

	if (config.NODE_ENV === "production") {
		if (!config.CLOUDINARY_CLOUD_NAME) {
			throw new Error(
				"CLOUDINARY_CLOUD_NAME não configurado em produção",
			);
		}
	}
};

validateConfig();

module.exports = config;