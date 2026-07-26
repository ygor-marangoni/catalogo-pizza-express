import { Request, Response, NextFunction } from "express";

class CouponController {
	constructor(private readonly service: any) {}

	list = async (_req: Request, res: Response, next: NextFunction) => {
		try {
			const items = await this.service.getAllCoupons();
			res.json({ success: true, data: { items, page: 1, limit: 100, total: items.length }, error: null });
		} catch (error) { next(error); }
	};

	publicList = async (_req: Request, res: Response, next: NextFunction) => {
		try {
			const items = await this.service.getPublicCoupons();
			res.json({ success: true, data: { items, page: 1, limit: 100, total: items.length }, error: null });
		} catch (error) { next(error); }
	};

	create = async (req: Request, res: Response, next: NextFunction) => {
		try { res.status(201).json({ success: true, data: await this.service.createCoupon(req.body), error: null }); }
		catch (error) { next(error); }
	};

	update = async (req: Request, res: Response, next: NextFunction) => {
		try { res.json({ success: true, data: await this.service.updateCoupon(Number(req.params.id), req.body), error: null }); }
		catch (error) { next(error); }
	};

	remove = async (req: Request, res: Response, next: NextFunction) => {
		try { await this.service.deleteCoupon(Number(req.params.id)); res.json({ success: true, data: null, error: null }); }
		catch (error) { next(error); }
	};

	validate = async (req: Request, res: Response, next: NextFunction) => {
		try { res.json({ success: true, data: await this.service.validate(req.body.code, req.body.subtotal), error: null }); }
		catch (error) { next(error); }
	};
}

export = CouponController;
