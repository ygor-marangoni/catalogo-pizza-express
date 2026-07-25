import type { StoreInput, StoreRepository, StoreResource } from "../types/domain";

class StoreService {
	private readonly storeRepository: StoreRepository;

	constructor(storeRepository: StoreRepository) {
		this.storeRepository = storeRepository;
	}

	async getStoreInfo(): Promise<StoreResource> {
		try {
			const store = await this.storeRepository.find();
			if (!store) {
				throw new Error(ErrorCode.STORE_INFO_NOT_FOUND);
			}
			return store;
		} catch (error) {
			throw error;
		}
	}

	async updateStoreInfo(storeData: StoreInput): Promise<StoreResource> {
		try {
			const store = await this.storeRepository.update(storeData);
			return store;
		} catch (error) {
			throw new Error(
				`Erro ao atualizar informações da loja: ${error.message}`,
			);
		}
	}

	async isStoreOpen(): Promise<boolean> {
		try {
			const store = await this.storeRepository.find();
			if (!store) {
				throw new Error(ErrorCode.STORE_INFO_NOT_FOUND);
			}
			return store.is_open;
		} catch (error) {
			throw new Error(
				`Erro ao verificar status da loja: ${error.message}`,
			);
		}
	}

	async setStoreStatus(isOpen: boolean): Promise<StoreResource> {
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
import { ErrorCode } from "../enums";
