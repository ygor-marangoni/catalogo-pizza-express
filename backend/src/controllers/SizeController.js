class SizeController {
	constructor(sizeService) {
		this.sizeService = sizeService;
	}

	async findAll(req, res, next) {
		try {
			const sizes = await this.sizeService.getAllSizes();

			res.json({
				success: true,
				data: sizes,
				error: null,
			});
		} catch (error) {
			next(error);
		}
	}

	async findById(req, res, next) {
		try {
			const { id } = req.params;
			const size = await this.sizeService.getSizeById(id);

			res.json({
				success: true,
				data: size,
				error: null,
			});
		} catch (error) {
			next(error);
		}
	}

	async create(req, res, next) {
		try {
			const sizeData = req.body;
			const size = await this.sizeService.createSize(sizeData);

			res.status(201).json({
				success: true,
				data: size,
				error: null,
			});
		} catch (error) {
			next(error);
		}
	}

	async update(req, res, next) {
		try {
			const { id } = req.params;
			const sizeData = req.body;
			const size = await this.sizeService.updateSize(id, sizeData);

			res.json({
				success: true,
				data: size,
				error: null,
			});
		} catch (error) {
			next(error);
		}
	}

	async delete(req, res, next) {
		try {
			const { id } = req.params;
			await this.sizeService.deleteSize(id);

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

module.exports = SizeController;