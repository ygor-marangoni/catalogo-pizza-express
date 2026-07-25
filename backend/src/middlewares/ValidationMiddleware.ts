import { ErrorCode } from "../enums";

class ValidationMiddleware {
	static validateProductCreate(req, res, next) {
		const { name, description, category_id, base_price } = req.body;

		if (!name || !category_id || base_price === undefined) {
			return res.status(400).json({
				success: false,
				data: null,
				error: {
					code: ErrorCode.VALIDATION_ERROR,
					message:
						"Campos obrigatórios: name, category_id, base_price",
					field: null,
				},
			});
		}

		if (typeof base_price !== "number" || base_price < 0) {
			return res.status(400).json({
				success: false,
				data: null,
				error: {
					code: ErrorCode.VALIDATION_ERROR,
					message: "base_price deve ser um número positivo",
					field: "base_price",
				},
			});
		}

		next();
	}

	static validateCategoryCreate(req, res, next) {
		const { name } = req.body;

		if (!name) {
			return res.status(400).json({
				success: false,
				data: null,
				error: {
					code: ErrorCode.VALIDATION_ERROR,
					message: "Campo obrigatório: name",
					field: "name",
				},
			});
		}

		next();
	}

	static validateSizeCreate(req, res, next) {
		const { name, code, additional_price } = req.body;

		if (!name || !code) {
			return res.status(400).json({
				success: false,
				data: null,
				error: {
					code: ErrorCode.VALIDATION_ERROR,
					message: "Campos obrigatórios: name, code",
					field: null,
				},
			});
		}

		next();
	}

	static validateEdgeCreate(req, res, next) {
		const { name } = req.body;

		if (!name) {
			return res.status(400).json({
				success: false,
				data: null,
				error: {
					code: ErrorCode.VALIDATION_ERROR,
					message: "Campo obrigatório: name",
					field: "name",
				},
			});
		}

		next();
	}

	static validateAdditionalCreate(req, res, next) {
		const { name, price } = req.body;

		if (!name || price === undefined) {
			return res.status(400).json({
				success: false,
				data: null,
				error: {
					code: ErrorCode.VALIDATION_ERROR,
					message: "Campos obrigatórios: name, price",
					field: null,
				},
			});
		}

		if (typeof price !== "number" || price < 0) {
			return res.status(400).json({
				success: false,
				data: null,
				error: {
					code: ErrorCode.VALIDATION_ERROR,
					message: "price deve ser um número positivo",
					field: "price",
				},
			});
		}

		next();
	}
}

module.exports = ValidationMiddleware;
