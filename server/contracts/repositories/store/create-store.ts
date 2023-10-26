import { Store } from "../../../models/store";

export interface CreateStoreRepository {
  create(input: CreateStoreRepository.Input): Promise<Store>;
}

export namespace CreateStoreRepository {
  export type Input = {
    name: string;
    url: string;
    currency: string;
    userId: number;
  };
}
