class AdditionalService {
	private readonly additionalRepository: any;

	constructor(additionalRepository) {
		this.additionalRepository = additionalRepository;
	}

	async getAllAdditionals() {
		try {
			const additionals = await this.additionalRepository.findAll();
			return additionals;
		} catch (error) {
			throw new Error(`Erro ao buscar adicionais: ${error.message}`);
		}
	}

	async getAdditionalById(id) {
		try {
			const additional = await this.additionalRepository.findById(id);
			if (!additional) {
				throw new Error(ErrorCode.ADDITIONAL_NOT_FOUND);
			}
			return additional;
		} catch (error) {
			throw error;
		}
	}

	async createAdditional(additionalData) {
		try {
			const additional = await this.additionalRepository.create(additionalData);
			return additional;
		} catch (error) {
			throw new Error(`Erro ao criar adicional: ${error.message}`);
		}
	}

	async updateAdditional(id, additionalData) {
		try {
			const additional = await this.additionalRepository.update(id, additionalData);
			return additional;
		} catch (error) {
			throw new Error(`Erro ao atualizar adicional: ${error.message}`);
		}
	}

	async deleteAdditional(id) {
		try {
			await this.additionalRepository.delete(id);
			return { success: true };
		} catch (error) {
			throw new Error(`Erro ao deletar adicional: ${error.message}`);
		}
	}
}

module.exports = AdditionalService;
import { ErrorCode } from "../entities/enums";
