import { AppDataSource } from "../config/ormConfig";
import { Store } from "../entities";
import type { UpdateStoreReqDTO } from "../dtos/req";
import type { StoreRepository, StoreResDTO } from "../dtos/res";

export class TypeOrmStoreRepository implements StoreRepository {
	private get repository() {
		return AppDataSource.getRepository(Store);
	}

	async find(): Promise<StoreResDTO | null> {
		return this.repository.findOne({
			where: { id: 1 },
		}) as Promise<StoreResDTO | null>;
	}

	async update(data: UpdateStoreReqDTO): Promise<StoreResDTO> {
		await this.repository.update(1, { ...data, updated_at: new Date() });
		return this.find() as Promise<StoreResDTO>;
	}

	async updateStatus(isOpen: boolean): Promise<StoreResDTO> {
		await this.repository.update(1, {
			is_open: isOpen,
			updated_at: new Date(),
		});
		return this.find() as Promise<StoreResDTO>;
	}
}
