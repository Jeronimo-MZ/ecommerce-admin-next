export interface DeleteCategoryRepository {
  delete(input: DeleteCategoryRepository.Input): Promise<void>;
}

export namespace DeleteCategoryRepository {
  export type Input = { id: number };
}
