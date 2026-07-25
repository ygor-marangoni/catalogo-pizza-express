require("dotenv").config();

const databaseConfig = {
	development: {
		client: "pg",
		connection: {
			host: process.env.DB_HOST || "localhost",
			port: process.env.DB_PORT || 5432,
			user: process.env.DB_USER || "postgres",
			password: process.env.DB_PASSWORD || "password",
			database: process.env.DB_NAME || "pizza_express_dev",
		},
		migrations: {
			directory: "./migrations",
		},
		seeds: {
			directory: "./seeds",
		},
	},
	production: {
		client: "pg",
		connection: process.env.DATABASE_URL,
		migrations: {
			directory: "./migrations",
		},
		seeds: {
			directory: "./seeds",
		},
	},
	test: {
		client: "pg",
		connection: {
			host: process.env.DB_HOST || "localhost",
			port: process.env.DB_PORT || 5432,
			user: process.env.DB_USER || "postgres",
			password: process.env.DB_PASSWORD || "password",
			database: process.env.DB_NAME || "pizza_express_test",
		},
		migrations: {
			directory: "./migrations",
		},
		seeds: {
			directory: "./seeds",
		},
	},
};

module.exports = databaseConfig[process.env.NODE_ENV || "development"];