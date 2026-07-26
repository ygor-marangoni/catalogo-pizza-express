import type { RegisterUserReqDTO, UpdateUserReqDTO } from "../dtos/req";
import { parseResourceId } from "../utils/ResourceId";

export class AdminCustomerController {
	constructor(private readonly authService: any) {}

	async list(req, res, next) {
		try {
			const users = await this.authService.listUsers(String(req.query.search || ""));
			res.json({ success: true, data: users.map(this.publicUser), error: null });
		} catch (error) {
			next(error);
		}
	}

	async get(req, res, next) {
		try {
			const user = await this.authService.getUserById(parseResourceId(req.params.id));
			res.json({ success: true, data: this.publicUser(user), error: null });
		} catch (error) {
			next(error);
		}
	}

	async create(req, res, next) {
		try {
			const user = await this.authService.registerUser(req.body as RegisterUserReqDTO);
			res.status(201).json({ success: true, data: this.publicUser(user), error: null });
		} catch (error) {
			next(error);
		}
	}

	async update(req, res, next) {
		try {
			const user = await this.authService.updateUser(
				parseResourceId(req.params.id),
				req.body as UpdateUserReqDTO,
			);
			res.json({ success: true, data: this.publicUser(user), error: null });
		} catch (error) {
			next(error);
		}
	}

	async delete(req, res, next) {
		try {
			await this.authService.deleteUser(parseResourceId(req.params.id));
			res.json({ success: true, data: null, error: null });
		} catch (error) {
			next(error);
		}
	}

	private publicUser(user) {
		return {
			id: user.id,
			name: user.name,
			email: user.email,
			created_at: user.created_at,
			updated_at: user.updated_at,
		};
	}
}
