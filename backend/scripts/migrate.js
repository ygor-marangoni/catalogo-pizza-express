require("dotenv").config();
const { AppDataSource } = require("../dist/src/config/ormConfig");

async function run() {
	await AppDataSource.initialize();
	await AppDataSource.runMigrations();
	await AppDataSource.destroy();
}

run().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
