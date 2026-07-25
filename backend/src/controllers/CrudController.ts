const Logger = require("../utils/Logger");
import { ErrorCode } from "../entities/enums";
import { parseResourceId } from "../utils/ResourceId";

export function createCrudController(service: any, resource: string) {
	const singular =
		(
			{
				Categories: "Category",
				Products: "Product",
				Additionals: "Additional",
				Edges: "Edge",
				Sizes: "Size",
			} as Record<string, string>
		)[resource] ?? resource.slice(0, -1);
	const validate = (body: any, isCreate = false): string | null => {
		if (!body || typeof body.name !== "string" || !body.name.trim()) return "name é obrigatório";
		if (
			resource === "Products" &&
			isCreate &&
			(!Number.isInteger(Number(body.category_id)) || Number(body.base_price) < 0)
		)
			return "category_id e base_price são obrigatórios e válidos";
		if (["Additionals", "Edges", "Sizes"].includes(resource) && body.price !== undefined && Number(body.price) < 0)
			return "o preço não pode ser negativo";
		return null;
	};
	return {
		findAll: async (req, res, next) => {
			try {
				const page = Math.max(Number(req.query.page) || 1, 1);
				const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100);
				const records = await service[`getAll${resource}`](req.query);
				res.json({
					success: true,
					data: {
						items: records.slice((page - 1) * limit, page * limit),
						page,
						limit,
						total: records.length,
					},
					error: null,
				});
			} catch (error) {
				next(error);
			}
		},
		findById: async (req, res, next) => {
			try {
				const id = parseResourceId(req.params.id);
				res.json({
					success: true,
					data: await service[`get${singular}ById`](id),
					error: null,
				});
			} catch (error) {
				next(error);
			}
		},
		create: async (req, res, next) => {
			try {
				const validationError = validate(req.body, true);
				if (validationError)
					return res.status(400).json({
						success: false,
						data: null,
						error: {
							code: "VALIDATION_ERROR",
							message: validationError,
							field: null,
						},
					});
				const record = await service[`create${singular}`](req.body);
				Logger.info("Recurso criado", {
					resource,
					id: record.id,
					adminId: req.user?.id,
				});
				res.status(201).json({ success: true, data: record, error: null });
			} catch (error) {
				next(error);
			}
		},
		update: async (req, res, next) => {
			try {
				const id = parseResourceId(req.params.id);
				const validationError = req.body.name === undefined ? null : validate(req.body);
				if (validationError)
					return res.status(400).json({
						success: false,
						data: null,
						error: {
							code: "VALIDATION_ERROR",
							message: validationError,
							field: null,
						},
					});
				const record = await service[`update${singular}`](id, req.body);
				Logger.info("Recurso atualizado", {
					resource,
					id: record.id,
					adminId: req.user?.id,
				});
				res.json({ success: true, data: record, error: null });
			} catch (error) {
				next(error);
			}
		},
		delete: async (req, res, next) => {
			try {
				const id = parseResourceId(req.params.id);
				await service[`delete${singular}`](id);
				Logger.info("Recurso excluído", {
					resource,
					id,
					adminId: req.user?.id,
				});
				res.json({ success: true, data: null, error: null });
			} catch (error) {
				next(error);
			}
		},
	};
}
