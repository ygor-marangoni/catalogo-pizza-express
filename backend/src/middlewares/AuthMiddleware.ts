const jwt = require("jsonwebtoken");
import { ErrorCode } from "../enums";

class AuthMiddleware {
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

			const decoded = jwt.verify(
				token,
				process.env.JWT_SECRET || "your-secret-key",
			);
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

	static generateToken(adminId) {
		return jwt.sign(
			{ id: adminId },
			process.env.JWT_SECRET || "your-secret-key",
			{ expiresIn: "24h" },
		);
	}
}

module.exports = AuthMiddleware;
