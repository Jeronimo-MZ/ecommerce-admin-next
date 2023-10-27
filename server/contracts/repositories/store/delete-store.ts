import { Store } from "../../../models/store";

export interface DeleteStoreRepository {
  delete(input: DeleteStoreRepository.Input): Promise<void>;
}

export namespace DeleteStoreRepository {
  export type Input = { id: number; userId: number };
}
