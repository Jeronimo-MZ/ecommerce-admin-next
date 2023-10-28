import { Size } from "../../../models/size";

export interface FindSizeRepository {
  findOne(input: FindSizeRepository.Input): Promise<Size | null>;
}

export namespace FindSizeRepository {
  export type Input = XOR<{ id: number; storeId: number }, { storeId: number; name: string }>;
}
