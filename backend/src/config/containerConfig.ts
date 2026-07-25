const CategoryService = require("../services/CategoryService");
const ProductService = require("../services/ProductService");
const StoreService = require("../services/StoreService");
const AdditionalService = require("../services/AdditionalService");
const EdgeService = require("../services/EdgeService");
const SizeService = require("../services/SizeService");
const AuthService = require("../services/AuthService");
import { InMemoryRepository } from "../repositories/InMemoryRepository";
import { InMemoryAdminRepository } from "../repositories/InMemoryAdminRepository";
import { InMemoryStoreRepository } from "../repositories/InMemoryStoreRepository";
import { TypeOrmAdminRepository } from "../repositories/TypeOrmAdminRepository";
import { TypeOrmRepository } from "../repositories/TypeOrmRepository";
import { TypeOrmStoreRepository } from "../repositories/TypeOrmStoreRepository";
import { Additional, Category, Edge, Product, Size, Order, Favorite } from "../entities";
import type { AdditionalResDTO, CategoryResDTO, EdgeResDTO, ProductResDTO, SizeResDTO } from "../dtos/res";
import { InMemoryUserRepository } from "../repositories/InMemoryUserRepository";
import { TypeOrmUserRepository } from "../repositories/TypeOrmUserRepository";

const useDatabase = process.env.USE_DATABASE === "true";
// Seleciona persistência em PostgreSQL ou em memória conforme o ambiente.
export const repositories = useDatabase
	? {
			admin: new TypeOrmAdminRepository(),
			user: new TypeOrmUserRepository(),
			category: new TypeOrmRepository<CategoryResDTO>(Category as any),
			product: new TypeOrmRepository<ProductResDTO>(Product as any),
			additional: new TypeOrmRepository<AdditionalResDTO>(Additional as any),
			edge: new TypeOrmRepository<EdgeResDTO>(Edge as any),
			size: new TypeOrmRepository<SizeResDTO>(Size as any),
			store: new TypeOrmStoreRepository(),
			order: new TypeOrmRepository<any>(Order as any),
			favorite: new TypeOrmRepository<any>(Favorite as any),
		}
	: {
			admin: new InMemoryAdminRepository(),
			user: new InMemoryUserRepository(),
			category: new InMemoryRepository<CategoryResDTO>(),
			product: new InMemoryRepository<ProductResDTO>(),
			additional: new InMemoryRepository<AdditionalResDTO>(),
			edge: new InMemoryRepository<EdgeResDTO>(),
			size: new InMemoryRepository<SizeResDTO>(),
			store: new InMemoryStoreRepository(),
			order: new InMemoryRepository<any>(),
			favorite: new InMemoryRepository<any>(),
		};

export const services = {
	auth: new AuthService(repositories.admin, repositories.user),
	category: new CategoryService(repositories.category),
	product: new ProductService(repositories.product, repositories.category),
	additional: new AdditionalService(repositories.additional),
	edge: new EdgeService(repositories.edge),
	size: new SizeService(repositories.size),
	store: new StoreService(repositories.store),
	order: repositories.order,
	favorite: repositories.favorite,
};
