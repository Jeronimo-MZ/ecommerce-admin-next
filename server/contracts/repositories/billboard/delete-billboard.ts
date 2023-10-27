export interface DeleteBillboardRepository {
  delete(input: DeleteBillboardRepository.Input): Promise<void>;
}

export namespace DeleteBillboardRepository {
  export type Input = { id: number };
}
