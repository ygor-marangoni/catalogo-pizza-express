import { In, IsNull } from "typeorm";
import { AppDataSource } from "../config/ormConfig";
import { Additional, Edge, Product, ProductAdditional, ProductEdge, ProductSize, Size } from "../entities";

type ConfigurationInput = {
	sizes: Array<{ size_id: number; price: number; is_default: boolean; available: boolean }>;
	edges: Array<{ edge_id: number; price_override?: number | null; available: boolean }>;
	additionals: Array<{ additional_id: number; price_override?: number | null; available: boolean }>;
};

export class TypeOrmProductConfigurationRepository {
	async findAll(productId?: number) {
		const sizeQuery = AppDataSource.getRepository(ProductSize).createQueryBuilder("link")
			.innerJoin(Size, "option", "option.id = link.size_id AND option.deleted_at IS NULL")
			.select([
				"link.product_id AS product_id", "option.id AS size_id", "option.name AS name",
				"option.code AS code", "option.description AS description", "link.price AS price",
				"link.is_default AS is_default", "link.available AS available",
			]).orderBy("link.product_id", "ASC").addOrderBy("link.price", "ASC");
		const edgeQuery = AppDataSource.getRepository(ProductEdge).createQueryBuilder("link")
			.innerJoin(Edge, "option", "option.id = link.edge_id AND option.deleted_at IS NULL")
			.select([
				"link.product_id AS product_id", "option.id AS edge_id", "option.name AS name",
				"option.description AS description", "option.additional_price AS global_price",
				"link.price_override AS price_override", "link.available AS available",
			]).orderBy("link.product_id", "ASC").addOrderBy("option.id", "ASC");
		const additionalQuery = AppDataSource.getRepository(ProductAdditional).createQueryBuilder("link")
			.innerJoin(Additional, "option", "option.id = link.additional_id AND option.deleted_at IS NULL")
			.select([
				"link.product_id AS product_id", "option.id AS additional_id", "option.name AS name",
				"option.description AS description", "option.price AS global_price",
				"link.price_override AS price_override", "link.available AS available",
			]).orderBy("link.product_id", "ASC").addOrderBy("option.id", "ASC");
		if (productId !== undefined) {
			sizeQuery.where("link.product_id = :productId", { productId });
			edgeQuery.where("link.product_id = :productId", { productId });
			additionalQuery.where("link.product_id = :productId", { productId });
		}
		const [sizes, edges, additionals] = await Promise.all([
			sizeQuery.getRawMany(), edgeQuery.getRawMany(), additionalQuery.getRawMany(),
		]);
		return this.group(sizes, edges, additionals);
	}

	async findByProductId(productId: number) {
		const configurations = await this.findAll(productId);
		return configurations.find((item) => item.product_id === productId) || {
			product_id: productId, sizes: [], edges: [], additionals: [],
		};
	}

	async save(productId: number, input: ConfigurationInput) {
		await AppDataSource.transaction(async (manager) => {
			const product = await manager.getRepository(Product).findOne({ where: { id: productId, deleted_at: IsNull() } });
			if (!product) throw Object.assign(new Error("Produto não encontrado"), { statusCode: 404, code: "PRODUCT_NOT_FOUND" });

			await this.ensureOptionsExist(manager, Size, input.sizes.map((item) => item.size_id), "tamanho");
			await this.ensureOptionsExist(manager, Edge, input.edges.map((item) => item.edge_id), "borda");
			await this.ensureOptionsExist(manager, Additional, input.additionals.map((item) => item.additional_id), "adicional");

			await manager.delete(ProductSize, { product_id: productId });
			await manager.delete(ProductEdge, { product_id: productId });
			await manager.delete(ProductAdditional, { product_id: productId });
			if (input.sizes.length) await manager.insert(ProductSize, input.sizes.map((item) => ({ product_id: productId, ...item })));
			if (input.edges.length) await manager.insert(ProductEdge, input.edges.map((item) => ({ product_id: productId, price_override: null, ...item })));
			if (input.additionals.length) await manager.insert(ProductAdditional, input.additionals.map((item) => ({ product_id: productId, price_override: null, ...item })));
			if (input.sizes.length) {
				product.base_price = Math.min(...input.sizes.filter((item) => item.available).map((item) => item.price));
				product.updated_at = new Date();
				await manager.save(product);
			}
		});
		return this.findByProductId(productId);
	}

	private async ensureOptionsExist(manager, entity, ids: number[], label: string) {
		if (!ids.length) return;
		const uniqueIds = [...new Set(ids)];
		const count = await manager.getRepository(entity).count({ where: { id: In(uniqueIds), deleted_at: IsNull() } });
		if (count !== uniqueIds.length)
			throw Object.assign(new Error(`Existe ${label} inválido ou indisponível na configuração`), { statusCode: 400, code: "VALIDATION_ERROR" });
	}

	private group(sizeRows: any[], edgeRows: any[], additionalRows: any[]) {
		const configurations = new Map<number, any>();
		const get = (productId: number) => {
			if (!configurations.has(productId))
				configurations.set(productId, { product_id: productId, sizes: [], edges: [], additionals: [] });
			return configurations.get(productId);
		};
		sizeRows.forEach((row) => get(Number(row.product_id)).sizes.push({
			size_id: Number(row.size_id), name: row.name, code: row.code, description: row.description,
			price: Number(row.price), is_default: Boolean(row.is_default), available: Boolean(row.available),
		}));
		edgeRows.forEach((row) => get(Number(row.product_id)).edges.push({
			edge_id: Number(row.edge_id), name: row.name, description: row.description,
			global_price: Number(row.global_price), price_override: row.price_override === null ? null : Number(row.price_override),
			price: row.price_override === null ? Number(row.global_price) : Number(row.price_override), available: Boolean(row.available),
		}));
		additionalRows.forEach((row) => get(Number(row.product_id)).additionals.push({
			additional_id: Number(row.additional_id), name: row.name, description: row.description,
			global_price: Number(row.global_price), price_override: row.price_override === null ? null : Number(row.price_override),
			price: row.price_override === null ? Number(row.global_price) : Number(row.price_override), available: Boolean(row.available),
		}));
		return [...configurations.values()];
	}
}
