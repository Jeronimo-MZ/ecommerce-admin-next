import { Store } from "../../../models/store";

export interface FindStoresRepository {
  findMany(input: FindStoresRepository.Input): Promise<Store[]>;
}

export namespace FindStoresRepository {
  export type Input = { userId: number };
}
