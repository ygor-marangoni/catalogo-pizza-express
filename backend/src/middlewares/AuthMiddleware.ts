const jwt = require("jsonwebtoken");
import { ErrorCode } from "../entities/enums";
import { getErrorMessage } from "../exceptions/ErrorMessages";

class AuthMiddleware {
	static getSecret() {
		return require("../config/envConfig").envConfig.JWT_SECRET;
	}
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
			req.user = jwt.verify(token, AuthMiddleware.getSecret());
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
		return jwt.sign({ id, role }, AuthMiddleware.getSecret(), { expiresIn: require("../config/envConfig").envConfig.JWT_EXPIRATION });
	}

	static generateRefreshToken(id, role = "ADMIN") {
		return jwt.sign({ id, role, type: "refresh" }, AuthMiddleware.getSecret(), { expiresIn: "7d" });
	}
}

module.exports = AuthMiddleware;
