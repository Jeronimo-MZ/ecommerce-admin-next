import { Color } from "../../../models/color";

export interface FindColorRepository {
  findOne(input: FindColorRepository.Input): Promise<Color | null>;
}

export namespace FindColorRepository {
  export type Input = XOR<{ id: number; storeId: number }, { storeId: number; name: string }>;
}
