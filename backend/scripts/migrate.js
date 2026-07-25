require("dotenv").config();
const { AppDataSource } = require("../dist/src/config/ormConfig");

const migrationAliases = [
	["CreateAccounts001", "CreateAccounts1710000000000", 1710000000000],
	["CreateCatalog002", "CreateCatalog1710000001000", 1710000001000],
	["CreateOrdersAndFavorites003", "CreateOrdersAndFavorites1710000002000", 1710000002000],
	["CreateStoreAndAuditLogs004", "CreateStoreAndAuditLogs1710000003000", 1710000003000],
	["AddCatalogUniqueConstraints005", "AddCatalogUniqueConstraints1710000004000", 1710000004000],
	["UseCaseInsensitiveCatalogIndexes006", "UseCaseInsensitiveCatalogIndexes1710000005000", 1710000005000],
];

async function normalizeMigrationHistory() {
	for (const [oldName, newName, timestamp] of migrationAliases) {
		await AppDataSource.query(
			"UPDATE migrations SET name = $1, timestamp = $2 WHERE name = $3",
			[newName, timestamp, oldName],
		);
	}
}

async function run() {
	await AppDataSource.initialize();
	try {
		await normalizeMigrationHistory();
	} catch (error) {
		if (error.code !== "42P01") throw error;
	}
	await AppDataSource.runMigrations();
	await AppDataSource.destroy();
	process.exit(0);
}

run().catch((error) => {
	console.error(error);
	AppDataSource.destroy().finally(() => process.exit(1));
});
