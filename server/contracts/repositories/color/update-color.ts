import { Color } from "../../../models/color";

export interface UpdateColorRepository {
  update(input: UpdateColorRepository.Input): Promise<Color>;
}

export namespace UpdateColorRepository {
  export type Input = {
    name: string;
    value: string;
    colorId: number;
    storeId: number;
  };
}
