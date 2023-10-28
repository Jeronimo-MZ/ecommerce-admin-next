export interface DeleteSizeRepository {
  delete(input: DeleteSizeRepository.Input): Promise<void>;
}

export namespace DeleteSizeRepository {
  export type Input = { id: number };
}
