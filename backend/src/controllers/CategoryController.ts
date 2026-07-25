const Hateoas = require("../utils/Hateoas");
import type { NextFunction, Request, Response } from "express";
import type { CreateCategoryReqDTO, UpdateCategoryReqDTO } from "../dtos/req";
import CategoryService = require("../services/CategoryService");

class CategoryController {
	private readonly categoryService: InstanceType<typeof CategoryService>;

	constructor(categoryService: InstanceType<typeof CategoryService>) {
		this.categoryService = categoryService;
	}

	async findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const categories = await this.categoryService.getAllCategories();

			res.json({
				success: true,
				data: Hateoas.list(categories, "categories"),
				error: null,
			});
		} catch (error) {
			next(error);
		}
	}

	async findById(req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> {
		try {
			const id = Number(req.params.id);
			const category = await this.categoryService.getCategoryById(id);

			res.json({
				success: true,
				data: Hateoas.item(category, "categories", category.id),
				error: null,
			});
		} catch (error) {
			next(error);
		}
	}

	async create(
		req: Request<Record<string, never>, unknown, CreateCategoryReqDTO>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const categoryData = req.body;
			const category = await this.categoryService.createCategory(categoryData);

			res.status(201).json({
				success: true,
				data: Hateoas.item(category, "categories", category.id),
				error: null,
			});
		} catch (error) {
			next(error);
		}
	}

	async update(
		req: Request<{ id: string }, unknown, UpdateCategoryReqDTO>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const id = Number(req.params.id);
			const categoryData = req.body;
			const category = await this.categoryService.updateCategory(id, categoryData);

			res.json({
				success: true,
				data: Hateoas.item(category, "categories", category.id),
				error: null,
			});
		} catch (error) {
			next(error);
		}
	}

	async delete(req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> {
		try {
			const id = Number(req.params.id);
			await this.categoryService.deleteCategory(id);

			res.json({
				success: true,
				data: null,
				error: null,
			});
		} catch (error) {
			next(error);
		}
	}
}

module.exports = CategoryController;
