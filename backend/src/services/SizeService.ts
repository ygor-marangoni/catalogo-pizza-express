class SizeService {
	private readonly sizeRepository: any;

	constructor(sizeRepository) {
		this.sizeRepository = sizeRepository;
	}

	async getAllSizes() {
		try {
			const sizes = await this.sizeRepository.findAll();
			return sizes;
		} catch (error) {
			throw new Error(`Erro ao buscar tamanhos: ${error.message}`);
		}
	}

	async getSizeById(id) {
		try {
			const size = await this.sizeRepository.findById(id);
			if (!size) {
				throw new Error(ErrorCode.SIZE_NOT_FOUND);
			}
			return size;
		} catch (error) {
			throw error;
		}
	}

	async createSize(sizeData) {
		try {
			const size = await this.sizeRepository.create(sizeData);
			return size;
		} catch (error) {
			throw new Error(`Erro ao criar tamanho: ${error.message}`);
		}
	}

	async updateSize(id, sizeData) {
		try {
			const size = await this.sizeRepository.update(id, sizeData);
			return size;
		} catch (error) {
			throw new Error(`Erro ao atualizar tamanho: ${error.message}`);
		}
	}

	async deleteSize(id) {
		try {
			await this.sizeRepository.delete(id);
			return { success: true };
		} catch (error) {
			throw new Error(`Erro ao deletar tamanho: ${error.message}`);
		}
	}
}

module.exports = SizeService;
import { ErrorCode } from "../enums";
