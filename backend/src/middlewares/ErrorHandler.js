class ErrorHandler {
	static handle(error, req, res, next) {
		const statusCode = error.statusCode || 500;
		const errorCode = error.code || "INTERNAL_ERROR";
		const message = error.message || "Erro interno do servidor";

		console.error(`[${new Date().toISOString()}] ${errorCode}: ${message}`);

		// Tratamento de erros conhecidos
		if (errorCode === "PRODUCT_NOT_FOUND") {
			return res.status(404).json({
				success: false,
				data: null,
				error: {
					code: "PRODUCT_NOT_FOUND",
					message: "Produto não encontrado",
					field: null,
				},
			});
		}

		if (errorCode === "CATEGORY_NOT_FOUND") {
			return res.status(404).json({
				success: false,
				data: null,
				error: {
					code: "CATEGORY_NOT_FOUND",
					message: "Categoria não encontrada",
					field: null,
				},
			});
		}

		if (errorCode === "INVALID_CREDENTIALS") {
			return res.status(401).json({
				success: false,
				data: null,
				error: {
					code: "INVALID_CREDENTIALS",
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