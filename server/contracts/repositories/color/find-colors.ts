import { Color } from "../../../models/color";

export interface FindColorsRepository {
  findMany(input: FindColorsRepository.Input): Promise<Color[]>;
}

export namespace FindColorsRepository {
  export type Input = { storeId: number };
}
