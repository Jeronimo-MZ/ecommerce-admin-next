import { Billboard } from "../../../models/billboard";

export interface UpdateBillboardRepository {
  update(input: UpdateBillboardRepository.Input): Promise<Billboard>;
}

export namespace UpdateBillboardRepository {
  export type Input = {
    label: string;
    imageUrl: string;
    billboardId: number;
  };
}
