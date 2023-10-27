import { Category, CategoryWithoutBillboard } from "../../../models/category";

export interface FindCategoriesRepository {
  findMany(input: FindCategoriesRepository.Input): Promise<Category[]>;
}

export namespace FindCategoriesRepository {
  export type Input = { storeId: number };
}
