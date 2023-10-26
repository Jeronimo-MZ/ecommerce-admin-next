import { Store } from "../../../models/store";

export interface FindStoreRepository {
  findOne(input: FindStoreRepository.Input): Promise<Store | null>;
}

export namespace FindStoreRepository {
  export type Input = XOR<{ id: number; userId?: number }, { name: string; userId: number }>;
}
