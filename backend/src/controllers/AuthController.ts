import { ErrorCode } from "../entities/enums";

class AuthController {
	private readonly authService: any;

	constructor(authService: any) {
		this.authService = authService;
	}

	private cookieOptions() {
		return {
			httpOnly: true,
			sameSite: "lax" as const,
			secure: process.env.COOKIE_SECURE === "true",
			maxAge: 604800000,
			path: "/api/v1/auth",
		};
	}

	async login(req, res, next) {
		try {
			const { email, password } = req.body;
			if (!email || !password)
				return res.status(400).json({
					success: false,
					data: null,
					error: {
						code: ErrorCode.INVALID_INPUT,
						message: "Email e senha são obrigatórios",
						field: null,
					},
				});
			const authenticated = await this.authService.authenticate(email, password);
			const auth = require("../middlewares/AuthMiddleware");
			const token = auth.generateToken(authenticated.account.id, authenticated.role);
			const refreshToken = auth.generateRefreshToken(authenticated.account.id, authenticated.role);
			res.cookie("refresh_token", refreshToken, this.cookieOptions());
			res.json({
				success: true,
				data: {
					id: authenticated.account.id,
					name: authenticated.account.name,
					email: authenticated.account.email,
					token,
					role: authenticated.role,
				},
				error: null,
			});
		} catch (error) {
			next(error);
		}
	}

	async registerUser(req, res, next) {
		try {
			const { name, email, password } = req.body;
			if (!name || !email || !password)
				return res.status(400).json({
					success: false,
					data: null,
					error: {
						code: ErrorCode.INVALID_INPUT,
						message: "Nome, email e senha são obrigatórios",
						field: null,
					},
				});
			const user = await this.authService.registerUser({
				name,
				email,
				password,
			});
			res.status(201).json({
				success: true,
				data: { id: user.id, name: user.name, email: user.email },
				error: null,
			});
		} catch (error) {
			next(error);
		}
	}

	async refresh(req, res) {
		try {
			const cookie = req.headers.cookie
				?.split(";")
				.map((value) => value.trim())
				.find((value) => value.startsWith("refresh_token="));
			if (!cookie)
				return res.status(401).json({
					success: false,
					data: null,
					error: {
						code: ErrorCode.UNAUTHORIZED,
						message: "Refresh token não fornecido",
						field: null,
					},
				});
			const jwt = require("jsonwebtoken");
			const decoded = jwt.verify(
				decodeURIComponent(cookie.split("=")[1]),
				process.env.JWT_SECRET || "your-secret-key",
			);
			if (decoded.type !== "refresh")
				return res.status(401).json({
					success: false,
					data: null,
					error: {
						code: ErrorCode.INVALID_TOKEN,
						message: "Refresh token inválido",
						field: null,
					},
				});
			const auth = require("../middlewares/AuthMiddleware");
			const role = decoded.role || "ADMIN";
			const token = auth.generateToken(decoded.id, role);
			const refreshToken = auth.generateRefreshToken(decoded.id, role);
			res.cookie("refresh_token", refreshToken, this.cookieOptions());
			res.json({ success: true, data: { token, role }, error: null });
		} catch {
			res.status(401).json({
				success: false,
				data: null,
				error: {
					code: ErrorCode.INVALID_TOKEN,
					message: "Refresh token inválido ou expirado",
					field: null,
				},
			});
		}
	}

	async logout(_req, res) {
		res.clearCookie("refresh_token", {
			httpOnly: true,
			sameSite: "lax",
			secure: process.env.COOKIE_SECURE === "true",
			path: "/api/v1/auth",
		});
		res.json({ success: true, data: null, error: null });
	}

	async me(req, res, next) {
		try {
			const admin = await this.authService.getAdminById(Number(req.user.id));
			res.json({
				success: true,
				data: { id: admin.id, name: admin.name, email: admin.email, role: "ADMIN" },
				error: null,
			});
		} catch (error) {
			next(error);
		}
	}
}

module.exports = AuthController;
