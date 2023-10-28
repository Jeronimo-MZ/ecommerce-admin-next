import { Size } from "../../../models/size";

export interface CreateSizeRepository {
  create(input: CreateSizeRepository.Input): Promise<Size>;
}

export namespace CreateSizeRepository {
  export type Input = {
    name: string;
    value: string;
    storeId: number;
  };
}
