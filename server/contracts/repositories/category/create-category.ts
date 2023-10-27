import { Category } from "../../../models/category";

export interface CreateCategoryRepository {
  create(input: CreateCategoryRepository.Input): Promise<Category>;
}

export namespace CreateCategoryRepository {
  export type Input = {
    name: string;
    billboardId: number;
    storeId: number;
  };
}
