import { ErrorCode } from "../enums";

class ErrorHandler {
	static handle(error, req, res, next) {
		const statusCode = error.statusCode || 500;
		const errorCode = error.code || ErrorCode.INTERNAL_ERROR;
		const message = error.message || "Erro interno do servidor";

		console.error(`[${new Date().toISOString()}] ${errorCode}: ${message}`);

		// Tratamento de erros conhecidos
		if (errorCode === ErrorCode.PRODUCT_NOT_FOUND) {
			return res.status(404).json({
				success: false,
				data: null,
				error: {
					code: ErrorCode.PRODUCT_NOT_FOUND,
					message: "Produto não encontrado",
					field: null,
				},
			});
		}

		if (errorCode === ErrorCode.CATEGORY_NOT_FOUND) {
			return res.status(404).json({
				success: false,
				data: null,
				error: {
					code: ErrorCode.CATEGORY_NOT_FOUND,
					message: "Categoria não encontrada",
					field: null,
				},
			});
		}

		if (errorCode === ErrorCode.INVALID_CREDENTIALS) {
			return res.status(401).json({
				success: false,
				data: null,
				error: {
					code: ErrorCode.INVALID_CREDENTIALS,
					message: "Email ou senha inválidos",
					field: null,
				},
			});
		}

		// Erro genérico
		return res.status(statusCode).json({
			success: false,
			data: null,
			error: {
				code: errorCode,
				message: message,
				field: error.field || null,
			},
		});
	}
}

module.exports = ErrorHandler;
