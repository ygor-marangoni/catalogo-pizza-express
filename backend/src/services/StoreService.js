class StoreService {
	constructor(storeRepository) {
		this.storeRepository = storeRepository;
	}

	async getStoreInfo() {
		try {
			const store = await this.storeRepository.find();
			if (!store) {
				throw new Error("STORE_INFO_NOT_FOUND");
			}
			return store;
		} catch (error) {
			throw error;
		}
	}

	async updateStoreInfo(storeData) {
		try {
			const store = await this.storeRepository.update(storeData);
			return store;
		} catch (error) {
			throw new Error(
				`Erro ao atualizar informações da loja: ${error.message}`,
			);
		}
	}

	async isStoreOpen() {
		try {
			const store = await this.storeRepository.find();
			return store.is_open;
		} catch (error) {
			throw new Error(
				`Erro ao verificar status da loja: ${error.message}`,
			);
		}
	}

	async setStoreStatus(isOpen) {
		try {
			const store = await this.storeRepository.updateStatus(isOpen);
			return store;
		} catch (error) {
			throw new Error(
				`Erro ao atualizar status da loja: ${error.message}`,
			);
		}
	}
}

module.exports = StoreService;