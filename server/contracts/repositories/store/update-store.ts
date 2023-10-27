import { Store } from "../../../models/store";

export interface UpdateStoreRepository {
  update(input: UpdateStoreRepository.Input): Promise<Store>;
}

export namespace UpdateStoreRepository {
  export type Input = {
    name: string;
    url: string;
    currency: string;
    userId: number;
    storeId: number;
  };
}
