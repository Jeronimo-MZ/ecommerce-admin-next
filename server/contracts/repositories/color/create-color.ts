import { Color } from "../../../models/color";

export interface CreateColorRepository {
  create(input: CreateColorRepository.Input): Promise<Color>;
}

export namespace CreateColorRepository {
  export type Input = {
    name: string;
    value: string;
    storeId: number;
  };
}
