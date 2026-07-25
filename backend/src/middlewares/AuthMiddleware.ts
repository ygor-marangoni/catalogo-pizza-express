const jwt = require("jsonwebtoken");
import { ErrorCode } from "../entities/enums";
import { getErrorMessage } from "../exceptions/ErrorMessages";

class AuthMiddleware {
	static requireRole(...roles) {
		return (req, res, next) =>
			roles.includes(req.user?.role)
				? next()
				: res.status(403).json({
						success: false,
						data: null,
						error: { code: ErrorCode.FORBIDDEN, message: getErrorMessage(ErrorCode.FORBIDDEN), field: null },
					});
	}

	static verifyToken(req, res, next) {
		try {
			const token = req.headers.authorization?.split(" ")[1];
			if (!token)
				return res.status(401).json({
					success: false,
					data: null,
					error: { code: ErrorCode.UNAUTHORIZED, message: getErrorMessage(ErrorCode.UNAUTHORIZED), field: null },
				});
			req.user = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
			next();
		} catch {
			return res.status(401).json({
				success: false,
				data: null,
				error: { code: ErrorCode.INVALID_TOKEN, message: getErrorMessage(ErrorCode.INVALID_TOKEN), field: null },
			});
		}
	}

	static generateToken(id, role = "ADMIN") {
		return jwt.sign({ id, role }, process.env.JWT_SECRET || "your-secret-key", { expiresIn: "24h" });
	}

	static generateRefreshToken(id, role = "ADMIN") {
		return jwt.sign({ id, role, type: "refresh" }, process.env.JWT_SECRET || "your-secret-key", { expiresIn: "7d" });
	}
}

module.exports = AuthMiddleware;
