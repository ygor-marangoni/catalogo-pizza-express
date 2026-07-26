require("dotenv").config();
const bcrypt = require("bcrypt");
const { Client } = require("@elastic/elasticsearch");
const { AppDataSource } = require("../dist/src/config/ormConfig");
const mockData = require("../seeds/mockData");

async function indexProducts(products) {
	const client = new Client({ node: process.env.ELASTICSEARCH_URL || "http://localhost:9200" });
	const index = process.env.ELASTICSEARCH_PRODUCTS_INDEX || "pizza-products";
	try {
		if (await client.indices.exists({ index })) await client.indices.delete({ index });
		await client.indices.create({
				index,
				mappings: {
					properties: {
						id: { type: "integer" },
						name: { type: "text", fields: { keyword: { type: "keyword" } } },
						description: { type: "text" },
						category_id: { type: "integer" },
						base_price: { type: "integer" },
						available: { type: "boolean" },
						highlighted: { type: "boolean" },
					},
				},
		});
		for (const product of products)
			await client.index({ index, id: String(product.id), document: product });
		await client.indices.refresh({ index });
	} catch (error) {
		console.warn(`NÃ£o foi possÃ­vel indexar os produtos no Elasticsearch: ${error.message}`);
	} finally {
		await client.close();
	}
}

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
			if (existing[0]) {
				await queryRunner.query("UPDATE categories SET description = $1, deleted_at = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = $2", [category.description, existing[0].id]);
				categoryIds.set(category.name, existing[0].id);
			}
			else {
				const [created] = await queryRunner.query(
					"INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING id",
					[category.name, category.description],
				);
				categoryIds.set(category.name, created.id);
			}
		}
		const legacyProductNames = ["Margherita", "Calabresa", "Portuguesa", "Frango com Catupiry", "Quatro Queijos", "Bacon", "Pepperoni"]
			.flatMap((name) => Array.from({ length: 8 }, (_, index) => `${name} ${index + 1}`));
		await queryRunner.query("UPDATE products SET deleted_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE name = ANY($1) AND deleted_at IS NULL", [legacyProductNames]);
		for (const product of mockData.products) {
			const exists = await queryRunner.query("SELECT id FROM products WHERE name = $1 LIMIT 1", [product.name]);
			if (exists[0])
				await queryRunner.query(
					"UPDATE products SET description = $1, category_id = $2, base_price = $3, available = TRUE, highlighted = $4, deleted_at = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = $5",
					[product.description, categoryIds.get(product.category_name), product.base_price, product.highlighted, exists[0].id],
				);
			else
				await queryRunner.query(
					"INSERT INTO products (name, description, category_id, base_price, available, highlighted) VALUES ($1, $2, $3, $4, TRUE, $5)",
					[
						product.name,
						product.description,
						categoryIds.get(product.category_name),
						product.base_price,
						product.highlighted,
					],
				);
		}
		for (const size of mockData.sizes) {
			const existing = await queryRunner.query("SELECT id FROM sizes WHERE LOWER(name) = LOWER($1) OR code = $2 LIMIT 1", [size.name, size.code]);
			if (existing[0])
				await queryRunner.query("UPDATE sizes SET name = $1, code = $2, description = $3, additional_price = $4, deleted_at = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = $5", [size.name, size.code, size.description, size.additional_price, existing[0].id]);
			else
				await queryRunner.query("INSERT INTO sizes (name, code, description, additional_price) VALUES ($1, $2, $3, $4)", [size.name, size.code, size.description, size.additional_price]);
		}
		for (const edge of mockData.edges) {
			const exists = await queryRunner.query("SELECT id FROM edges WHERE LOWER(name) = LOWER($1) LIMIT 1", [edge.name]);
			if (exists[0])
				await queryRunner.query("UPDATE edges SET name = $1, description = $2, additional_price = $3, deleted_at = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = $4", [edge.name, edge.description, edge.additional_price, exists[0].id]);
			else
				await queryRunner.query("INSERT INTO edges (name, description, additional_price) VALUES ($1, $2, $3)", [edge.name, edge.description, edge.additional_price]);
		}
		for (const additional of mockData.additionals) {
			const exists = await queryRunner.query("SELECT id FROM additionals WHERE LOWER(name) = LOWER($1) LIMIT 1", [
				additional.name,
			]);
			if (exists[0])
				await queryRunner.query("UPDATE additionals SET name = $1, description = $2, price = $3, deleted_at = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = $4", [additional.name, additional.description, additional.price, exists[0].id]);
			else
				await queryRunner.query("INSERT INTO additionals (name, description, price) VALUES ($1, $2, $3)", [additional.name, additional.description, additional.price]);
		}
		const sizeRows = await queryRunner.query("SELECT id FROM sizes WHERE deleted_at IS NULL ORDER BY id");
		const edgeRows = await queryRunner.query("SELECT id, name FROM edges WHERE deleted_at IS NULL ORDER BY id");
		const additionalRows = await queryRunner.query("SELECT id FROM additionals WHERE deleted_at IS NULL ORDER BY id");
		const seedProductRows = await queryRunner.query("SELECT id, name, category_id FROM products WHERE name = ANY($1) AND deleted_at IS NULL", [mockData.products.map((product) => product.name)]);
		const pizzaCategoryIds = new Set([...categoryIds.entries()].filter(([name]) => name.toLocaleLowerCase().includes("pizza")).map(([, id]) => id));
		for (const product of seedProductRows) {
			await queryRunner.query("DELETE FROM product_sizes WHERE product_id = $1", [product.id]);
			await queryRunner.query("DELETE FROM product_edges WHERE product_id = $1", [product.id]);
			await queryRunner.query("DELETE FROM product_additionals WHERE product_id = $1", [product.id]);
			if (!pizzaCategoryIds.has(product.category_id)) continue;
			for (const size of sizeRows) await queryRunner.query("INSERT INTO product_sizes (product_id, size_id) VALUES ($1, $2) ON CONFLICT DO NOTHING", [product.id, size.id]);
			const productSeed = mockData.products.find((item) => item.name === product.name);
			const isSweet = productSeed?.category_name === "Pizzas doces";
			for (const edge of edgeRows.filter((item) => isSweet ? item.name === "Chocolate" : item.name !== "Chocolate")) await queryRunner.query("INSERT INTO product_edges (product_id, edge_id) VALUES ($1, $2) ON CONFLICT DO NOTHING", [product.id, edge.id]);
			for (const additional of additionalRows) await queryRunner.query("INSERT INTO product_additionals (product_id, additional_id) VALUES ($1, $2) ON CONFLICT DO NOTHING", [product.id, additional.id]);
		}
		const customerRows = await queryRunner.query("SELECT id, email FROM users WHERE email = ANY($1)", [
			mockData.customers.map((customer) => customer.email),
		]);
		const productRows = await queryRunner.query("SELECT id, name, base_price FROM products WHERE name = ANY($1)", [
			mockData.products.map((product) => product.name),
		]);
		const indexedProducts = await queryRunner.query(
			"SELECT id, name, description, category_id, base_price, image_url, available, highlighted, created_at, updated_at FROM products WHERE deleted_at IS NULL",
		);
		await indexProducts(indexedProducts);
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
