import type { z } from "zod";

export function validate(schema: z.ZodType, source: "body" | "params" | "query" = "body") {
	// Valida e normaliza o corpo, parâmetros ou query da requisição.
	return (req, res, next) => {
		const result = schema.safeParse(req[source]);
		if (!result.success) {
			const issue = result.error.issues[0];
			const field = issue.path.join(".") || "dados";
			const message = issue.message.includes("Ã") || issue.message.includes("Expected")
				? `O campo ${field} possui um valor inválido`
				: issue.code === "invalid_type"
					? `O campo ${field} é obrigatório ou possui um tipo inválido`
					: issue.code === "too_small"
						? `O campo ${field} não atende ao tamanho ou valor mínimo exigido`
						: issue.code === "invalid_format"
							? `O campo ${field} está em formato inválido`
					: issue.code === "unrecognized_keys"
						? `A requisição contém campos não permitidos: ${issue.keys.join(", ")}`
								: issue.message;
			return res.status(400).json({
				success: false,
				data: null,
				error: {
					code: "VALIDATION_ERROR",
					message,
					field: issue.path.join(".") || null,
				},
			});
		}
		req[source] = result.data;
		next();
	};
}
