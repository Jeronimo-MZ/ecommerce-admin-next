import { Product } from "../../../models/product";

export interface CreateProductRepository {
  create(input: CreateProductRepository.Input): Promise<Product>;
}

export namespace CreateProductRepository {
  export type Input = {
    name: string;
    price: number;
    quantityInStock: number;
    storeId: number;
    sizeId: number;
    categoryId: number;
    colorId: number;
    images: string[];
  };
}
