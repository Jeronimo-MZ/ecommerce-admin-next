import { Category } from "../../../models/category";

export interface FindCategoryRepository {
  findOne(input: FindCategoryRepository.Input): Promise<Category | null>;
}

export namespace FindCategoryRepository {
  export type Input = XOR<{ id: number; storeId: number }, { storeId: number; name: string }>;
}
