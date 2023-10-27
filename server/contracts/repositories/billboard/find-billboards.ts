import { Billboard } from "../../../models/billboard";

export interface FindBillboardsRepository {
  findMany(input: FindBillboardsRepository.Input): Promise<Billboard[]>;
}

export namespace FindBillboardsRepository {
  export type Input = { storeId: number };
}
