import { Size } from "../../../models/size";

export interface FindSizesRepository {
  findMany(input: FindSizesRepository.Input): Promise<Size[]>;
}

export namespace FindSizesRepository {
  export type Input = { storeId: number };
}
