import type { NextFunction, Request, Response } from "express";

class ProductConfigurationController {
	constructor(private readonly service: any) {}

	list = async (_req: Request, res: Response, next: NextFunction) => {
		try {
			const items = await this.service.getAllConfigurations();
			res.json({ success: true, data: { items, page: 1, limit: items.length, total: items.length }, error: null });
		} catch (error) { next(error); }
	};

	get = async (req: Request, res: Response, next: NextFunction) => {
		try {
			res.json({ success: true, data: await this.service.getProductConfiguration(Number(req.params.id)), error: null });
		} catch (error) { next(error); }
	};

	update = async (req: Request, res: Response, next: NextFunction) => {
		try {
			res.json({ success: true, data: await this.service.updateProductConfiguration(Number(req.params.id), req.body), error: null });
		} catch (error) { next(error); }
	};
}

export = ProductConfigurationController;
