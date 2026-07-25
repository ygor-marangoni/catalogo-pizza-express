import "reflect-metadata";
import { DataSource } from "typeorm";
import { ormEntities } from "../entities";
import { withTimeout } from "../utils/Resilience";

// Define a conexão TypeORM e as entidades usadas pelo PostgreSQL.
export const AppDataSource = new DataSource({
	type: "postgres",
	url: process.env.DATABASE_URL,
	host: process.env.DATABASE_URL ? undefined : process.env.DB_HOST || "localhost",
	port: process.env.DATABASE_URL ? undefined : Number(process.env.DB_PORT || 5432),
	username: process.env.DATABASE_URL ? undefined : process.env.DB_USER || "postgres",
	password: process.env.DATABASE_URL ? undefined : process.env.DB_PASSWORD || "password",
	database: process.env.DATABASE_URL ? undefined : process.env.DB_NAME || "db_pizza_express_dev",
	entities: ormEntities,
	migrations: ["dist/src/entities/migrations/*.js"],
	synchronize: false,
	logging: process.env.NODE_ENV === "development" && process.env.TYPEORM_LOGGING === "true",
});

export async function initializeDatabase(): Promise<void> {
	await withTimeout(
		AppDataSource.initialize(),
		Number(process.env.DATABASE_INIT_TIMEOUT_MS || 10000),
		"Tempo limite ao conectar ao banco de dados",
	);
}
