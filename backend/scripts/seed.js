require("dotenv").config();
const bcrypt = require("bcrypt");
const { AppDataSource } = require("../dist/src/config/ormConfig");
const mockData = require("../seeds/mockData");

async function run() {
	await AppDataSource.initialize();
	const queryRunner = AppDataSource.createQueryRunner();
	await queryRunner.connect();
	await queryRunner.startTransaction();
	try {
		const adminHash = await bcrypt.hash(mockData.admin.password, 10);
		await queryRunner.query(
			"INSERT INTO admins (name, email, password_hash) VALUES ($1, $2, $3) ON CONFLICT (email) DO NOTHING",
			[mockData.admin.name, mockData.admin.email, adminHash],
		);
		for (const customer of mockData.customers) {
			const customerHash = await bcrypt.hash(customer.password, 10);
			await queryRunner.query(
				"INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) ON CONFLICT (email) DO NOTHING",
				[customer.name, customer.email, customerHash],
			);
		}
		await queryRunner.query(
			"INSERT INTO stores (id, name, description, opening_hours, delivery_fee, min_order_value) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description, opening_hours = EXCLUDED.opening_hours, delivery_fee = EXCLUDED.delivery_fee, min_order_value = EXCLUDED.min_order_value",
			[
				mockData.store.id,
				mockData.store.name,
				mockData.store.description,
				mockData.store.opening_hours,
				mockData.store.delivery_fee,
				mockData.store.min_order_value,
			],
		);
		const categoryIds = new Map();
		for (const category of mockData.categories) {
			const existing = await queryRunner.query("SELECT id FROM categories WHERE name = $1 LIMIT 1", [
				category.name,
			]);
			if (existing[0]) categoryIds.set(category.name, existing[0].id);
			else {
				const [created] = await queryRunner.query(
					"INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING id",
					[category.name, category.description],
				);
				categoryIds.set(category.name, created.id);
			}
		}
		for (const [index, product] of mockData.products.entries()) {
			const exists = await queryRunner.query("SELECT id FROM products WHERE name = $1 LIMIT 1", [product.name]);
			if (!exists[0])
				await queryRunner.query(
					"INSERT INTO products (name, description, category_id, base_price, highlighted) VALUES ($1, $2, $3, $4, $5)",
					[
						product.name,
						product.description,
						categoryIds.get(product.category_name),
						product.base_price,
						product.highlighted,
					],
				);
		}
		for (const size of mockData.sizes)
			await queryRunner.query(
				"INSERT INTO sizes (name, code, description, additional_price) VALUES ($1, $2, $3, $4) ON CONFLICT (code) DO NOTHING",
				[size.name, size.code, size.description, size.additional_price],
			);
		for (const edge of mockData.edges) {
			const exists = await queryRunner.query("SELECT id FROM edges WHERE name = $1 LIMIT 1", [edge.name]);
			if (!exists[0])
				await queryRunner.query("INSERT INTO edges (name, description, additional_price) VALUES ($1, $2, $3)", [
					edge.name,
					edge.description,
					edge.additional_price,
				]);
		}
		for (const additional of mockData.additionals) {
			const exists = await queryRunner.query("SELECT id FROM additionals WHERE name = $1 LIMIT 1", [
				additional.name,
			]);
			if (!exists[0])
				await queryRunner.query("INSERT INTO additionals (name, description, price) VALUES ($1, $2, $3)", [
					additional.name,
					additional.description,
					additional.price,
				]);
		}
		const customerRows = await queryRunner.query("SELECT id, email FROM users WHERE email = ANY($1)", [
			mockData.customers.map((customer) => customer.email),
		]);
		const productRows = await queryRunner.query("SELECT id, name, base_price FROM products WHERE name = ANY($1)", [
			mockData.products.map((product) => product.name),
		]);
		for (const [customerIndex, customer] of customerRows.entries()) {
			const selectedProducts = productRows.slice(customerIndex % 5, (customerIndex % 5) + 3);
			for (const [productIndex, product] of selectedProducts.entries()) {
				await queryRunner.query(
					"INSERT INTO favorites (user_id, product_id) VALUES ($1, $2) ON CONFLICT (user_id, product_id) DO NOTHING",
					[customer.id, product.id],
				);
				if (productIndex === 0) {
					const existingOrder = await queryRunner.query("SELECT id FROM orders WHERE user_id = $1 LIMIT 1", [customer.id]);
					if (!existingOrder[0])
						await queryRunner.query(
							"INSERT INTO orders (user_id, items, total, status) VALUES ($1, $2, $3, $4)",
							[customer.id, JSON.stringify([{ product_id: product.id, quantity: 1, unit_price: product.base_price }]), product.base_price + mockData.store.delivery_fee, customerIndex % 3 === 0 ? "DELIVERED" : "PENDING"],
						);
				}
			}
		}
		await queryRunner.commitTransaction();
	} catch (error) {
		await queryRunner.rollbackTransaction();
		throw error;
	} finally {
		await queryRunner.release();
		await AppDataSource.destroy();
	}
}

run().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
