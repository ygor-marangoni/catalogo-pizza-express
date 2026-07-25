class EdgeService {
	private readonly edgeRepository: any;

	constructor(edgeRepository) {
		this.edgeRepository = edgeRepository;
	}

	async getAllEdges() {
		try {
			const edges = await this.edgeRepository.findAll();
			return edges;
		} catch (error) {
			throw new Error(`Erro ao buscar bordas: ${error.message}`);
		}
	}

	async getEdgeById(id) {
		try {
			const edge = await this.edgeRepository.findById(id);
			if (!edge) {
				throw new Error(ErrorCode.EDGE_NOT_FOUND);
			}
			return edge;
		} catch (error) {
			throw error;
		}
	}

	async createEdge(edgeData) {
		try {
			const edge = await this.edgeRepository.create(edgeData);
			return edge;
		} catch (error) {
			throw new Error(`Erro ao criar borda: ${error.message}`);
		}
	}

	async updateEdge(id, edgeData) {
		try {
			const edge = await this.edgeRepository.update(id, edgeData);
			return edge;
		} catch (error) {
			throw new Error(`Erro ao atualizar borda: ${error.message}`);
		}
	}

	async deleteEdge(id) {
		try {
			await this.edgeRepository.delete(id);
			return { success: true };
		} catch (error) {
			throw new Error(`Erro ao deletar borda: ${error.message}`);
		}
	}
}

module.exports = EdgeService;
import { ErrorCode } from "../enums";
