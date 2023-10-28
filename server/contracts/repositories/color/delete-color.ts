export interface DeleteColorRepository {
  delete(input: DeleteColorRepository.Input): Promise<void>;
}

export namespace DeleteColorRepository {
  export type Input = { id: number };
}
