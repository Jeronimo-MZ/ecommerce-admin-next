import { Product } from "../../../models/product";

export interface UpdateProductRepository {
  update(input: UpdateProductRepository.Input): Promise<Product>;
}

export namespace UpdateProductRepository {
  export type Input = {
    id: number;
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
