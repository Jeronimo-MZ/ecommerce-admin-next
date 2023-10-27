import { Category } from "../../../models/category";

export interface UpdateCategoryRepository {
  update(input: UpdateCategoryRepository.Input): Promise<Category>;
}

export namespace UpdateCategoryRepository {
  export type Input = {
    name: string;
    billboardId: number;
    categoryId: number;
    storeId: number;
  };
}
