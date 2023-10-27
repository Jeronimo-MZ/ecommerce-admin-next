import { Billboard } from "../../../models/billboard";

export interface FindBillboardRepository {
  findOne(input: FindBillboardRepository.Input): Promise<Billboard | null>;
}

export namespace FindBillboardRepository {
  export type Input = { id: number; storeId: number };
}
