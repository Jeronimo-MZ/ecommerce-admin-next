import { Size } from "../../../models/size";

export interface UpdateSizeRepository {
  update(input: UpdateSizeRepository.Input): Promise<Size>;
}

export namespace UpdateSizeRepository {
  export type Input = {
    name: string;
    value: string;
    sizeId: number;
    storeId: number;
  };
}
