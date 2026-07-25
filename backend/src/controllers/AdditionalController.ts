class AdditionalController {
	private readonly additionalService: {
		getAllAdditionals: () => Promise<unknown[]>;
		getAdditionalById: (id: string) => Promise<unknown>;
		createAdditional: (data: unknown) => Promise<unknown>;
		updateAdditional: (id: string, data: unknown) => Promise<unknown>;
		deleteAdditional: (id: string) => Promise<unknown>;
	};

	constructor(additionalService) {
		this.additionalService = additionalService;
	}

	async findAll(req, res, next) {
		try {
			const additionals = await this.additionalService.getAllAdditionals();

			res.json({
				success: true,
				data: additionals,
				error: null,
			});
		} catch (error) {
			next(error);
		}
	}

	async findById(req, res, next) {
		try {
			const { id } = req.params;
			const additional = await this.additionalService.getAdditionalById(id);

			res.json({
				success: true,
				data: additional,
				error: null,
			});
		} catch (error) {
			next(error);
		}
	}

	async create(req, res, next) {
		try {
			const additionalData = req.body;
			const additional = await this.additionalService.createAdditional(additionalData);

			res.status(201).json({
				success: true,
				data: additional,
				error: null,
			});
		} catch (error) {
			next(error);
		}
	}

	async update(req, res, next) {
		try {
			const { id } = req.params;
			const additionalData = req.body;
			const additional = await this.additionalService.updateAdditional(id, additionalData);

			res.json({
				success: true,
				data: additional,
				error: null,
			});
		} catch (error) {
			next(error);
		}
	}

	async delete(req, res, next) {
		try {
			const { id } = req.params;
			await this.additionalService.deleteAdditional(id);

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

module.exports = AdditionalController;
