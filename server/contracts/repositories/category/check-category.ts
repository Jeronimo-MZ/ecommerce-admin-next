export interface CheckCategoryRepository {
  checkBy(input: CheckCategoryRepository.Input): Promise<boolean>;
}

export namespace CheckCategoryRepository {
  export type Input = { storeId: number; billboardId: number };
}
