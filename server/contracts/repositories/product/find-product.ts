import { Product } from "../../../models/product";

export interface FindProductRepository {
  findOne(input: FindProductRepository.Input): Promise<Product | null>;
}

export namespace FindProductRepository {
  export type Input = XOR<{ id: number }, { name: string }> & { storeId: number };
}
