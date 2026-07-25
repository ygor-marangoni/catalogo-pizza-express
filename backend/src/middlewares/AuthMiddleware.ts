const jwt = require("jsonwebtoken");
import { ErrorCode } from "../entities/enums";

class AuthMiddleware {
	// Restringe o acesso conforme o perfil presente no JWT.
	static requireRole(...roles) {
		return (req, res, next) =>
			roles.includes(req.user?.role)
				? next()
				: res.status(403).json({
						success: false,
						data: null,
						error: {
							code: "FORBIDDEN",
							message: "Perfil sem permissão para este recurso",
							field: null,
						},
					});
	}
	// Valida o token de acesso enviado no cabeçalho Authorization.
	static verifyToken(req, res, next) {
		try {
			const token = req.headers.authorization?.split(" ")[1];

			if (!token) {
				return res.status(401).json({
					success: false,
					data: null,
					error: {
						code: ErrorCode.UNAUTHORIZED,
						message: "Token não fornecido",
						field: null,
					},
				});
			}

			const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
			req.user = decoded;
			next();
		} catch (error) {
			return res.status(401).json({
				success: false,
				data: null,
				error: {
					code: ErrorCode.INVALID_TOKEN,
					message: "Token inválido ou expirado",
					field: null,
				},
			});
		}
	}

	// Gera tokens de acesso e renovação com o perfil do usuário.
	static generateToken(id, role = "ADMIN") {
		return jwt.sign({ id, role }, process.env.JWT_SECRET || "your-secret-key", {
			expiresIn: "24h",
		});
	}

	static generateRefreshToken(id, role = "ADMIN") {
		return jwt.sign({ id, role, type: "refresh" }, process.env.JWT_SECRET || "your-secret-key", {
			expiresIn: "7d",
		});
	}
}

module.exports = AuthMiddleware;
