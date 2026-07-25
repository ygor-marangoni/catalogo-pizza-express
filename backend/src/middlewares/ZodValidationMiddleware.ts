import type { z } from "zod";

export function validate(schema: z.ZodType, source: "body" | "params" | "query" = "body") {
	// Valida e normaliza o corpo, parâmetros ou query da requisição.
	return (req, res, next) => {
		const result = schema.safeParse(req[source]);
		if (!result.success) {
			const issue = result.error.issues[0];
			return res.status(400).json({
				success: false,
				data: null,
				error: {
					code: "VALIDATION_ERROR",
					message: issue.message,
					field: issue.path.join(".") || null,
				},
			});
		}
		req[source] = result.data;
		next();
	};
}
