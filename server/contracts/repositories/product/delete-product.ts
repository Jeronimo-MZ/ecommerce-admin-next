export interface DeleteProductRepository {
  delete(input: DeleteProductRepository.Input): Promise<void>;
}

export namespace DeleteProductRepository {
  export type Input = { id: number };
}
