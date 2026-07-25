class StoreController {
	constructor(storeService) {
		this.storeService = storeService;
	}

	async getInfo(req, res, next) {
		try {
			const store = await this.storeService.getStoreInfo();

			res.json({
				success: true,
				data: store,
				error: null,
			});
		} catch (error) {
			next(error);
		}
	}

	async updateInfo(req, res, next) {
		try {
			const storeData = req.body;
			const store = await this.storeService.updateStoreInfo(storeData);

			res.json({
				success: true,
				data: store,
				error: null,
			});
		} catch (error) {
			next(error);
		}
	}

	async getStatus(req, res, next) {
		try {
			const isOpen = await this.storeService.isStoreOpen();

			res.json({
				success: true,
				data: { is_open: isOpen },
				error: null,
			});
		} catch (error) {
			next(error);
		}
	}

	async updateStatus(req, res, next) {
		try {
			const { is_open } = req.body;

			if (typeof is_open !== "boolean") {
				return res.status(400).json({
					success: false,
					data: null,
					error: {
						code: "INVALID_INPUT",
						message: "is_open deve ser um booleano",
						field: "is_open",
					},
				});
			}

			const store = await this.storeService.setStoreStatus(is_open);

			res.json({
				success: true,
				data: store,
				error: null,
			});
		} catch (error) {
			next(error);
		}
	}
}

module.exports = StoreController;