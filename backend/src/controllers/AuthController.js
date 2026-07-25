class AuthController {
	constructor(authService) {
		this.authService = authService;
	}

	async login(req, res, next) {
		try {
			const { email, password } = req.body;

			if (!email || !password) {
				return res.status(400).json({
					success: false,
					data: null,
					error: {
						code: "INVALID_INPUT",
						message: "Email e senha são obrigatórios",
						field: null,
					},
				});
			}

			const admin = await this.authService.login(email, password);

			res.json({
				success: true,
				data: {
					id: admin.id,
					name: admin.name,
					email: admin.email,
				},
				error: null,
			});
		} catch (error) {
			next(error);
		}
	}

	async refresh(req, res, next) {
		try {
			// TODO: Implementar lógica de refresh token

			res.json({
				success: true,
				data: {},
				error: null,
			});
		} catch (error) {
			next(error);
		}
	}

	async logout(req, res, next) {
		try {
			res.json({
				success: true,
				data: null,
				error: null,
			});
		} catch (error) {
			next(error);
		}
	}
}

module.exports = AuthController;