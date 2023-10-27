import { Billboard } from "../../../models/billboard";

export interface CreateBillboardRepository {
  create(input: CreateBillboardRepository.Input): Promise<Billboard>;
}

export namespace CreateBillboardRepository {
  export type Input = {
    label: string;
    imageUrl: string;
    storeId: number;
  };
}
