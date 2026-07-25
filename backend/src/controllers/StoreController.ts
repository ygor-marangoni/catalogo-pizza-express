class StoreController {
	private readonly storeService: {
		getStoreInfo: () => Promise<Record<string, unknown>>;
		updateStoreInfo: (data: Record<string, unknown>) => Promise<Record<string, unknown>>;
		isStoreOpen: () => Promise<boolean>;
		setStoreStatus: (isOpen: boolean) => Promise<Record<string, unknown>>;
	};

	constructor(storeService) {
		this.storeService = storeService;
	}

	async getInfo(req, res, next) {
		try {
			const store = await this.storeService.getStoreInfo();

			res.json({
				success: true,
				data: {
					...store,
					_links: {
						self: { href: "/api/v1/store" },
						update: { href: "/api/v1/store", method: "PUT" },
						status: { href: "/api/v1/store/status" },
					},
				},
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
				data: {
					...store,
					_links: {
						self: { href: "/api/v1/store" },
						update: { href: "/api/v1/store", method: "PUT" },
						status: { href: "/api/v1/store/status" },
					},
				},
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
				data: {
					is_open: isOpen,
					_links: {
						self: { href: "/api/v1/store/status" },
						update: { href: "/api/v1/store/status", method: "PUT" },
						store: { href: "/api/v1/store" },
					},
				},
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
				data: {
					...store,
					_links: {
						self: { href: "/api/v1/store/status" },
						update: { href: "/api/v1/store/status", method: "PUT" },
						store: { href: "/api/v1/store" },
					},
				},
				error: null,
			});
		} catch (error) {
			next(error);
		}
	}
}

module.exports = StoreController;
