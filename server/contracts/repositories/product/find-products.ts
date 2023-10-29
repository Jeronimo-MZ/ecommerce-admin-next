import { Product } from "../../../models/product";

export interface FindProductsRepository {
  findMany(input: FindProductsRepository.Input): Promise<FindProductsRepository.Output>;
}

export namespace FindProductsRepository {
  export type Input = {
    storeId: number;
    categoryId?: number;
    sizeId?: number;
    colorId?: number;
    inStockOnly?: boolean;
  };
  export type Output = Omit<Product, "images">[];
}
