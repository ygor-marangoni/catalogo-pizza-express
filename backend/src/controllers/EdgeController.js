class EdgeController {
	constructor(edgeService) {
		this.edgeService = edgeService;
	}

	async findAll(req, res, next) {
		try {
			const edges = await this.edgeService.getAllEdges();

			res.json({
				success: true,
				data: edges,
				error: null,
			});
		} catch (error) {
			next(error);
		}
	}

	async findById(req, res, next) {
		try {
			const { id } = req.params;
			const edge = await this.edgeService.getEdgeById(id);

			res.json({
				success: true,
				data: edge,
				error: null,
			});
		} catch (error) {
			next(error);
		}
	}

	async create(req, res, next) {
		try {
			const edgeData = req.body;
			const edge = await this.edgeService.createEdge(edgeData);

			res.status(201).json({
				success: true,
				data: edge,
				error: null,
			});
		} catch (error) {
			next(error);
		}
	}

	async update(req, res, next) {
		try {
			const { id } = req.params;
			const edgeData = req.body;
			const edge = await this.edgeService.updateEdge(id, edgeData);

			res.json({
				success: true,
				data: edge,
				error: null,
			});
		} catch (error) {
			next(error);
		}
	}

	async delete(req, res, next) {
		try {
			const { id } = req.params;
			await this.edgeService.deleteEdge(id);

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

module.exports = EdgeController;