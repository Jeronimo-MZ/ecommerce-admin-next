export interface DeleteOrderRepository {
  delete(input: DeleteOrderRepository.Input): Promise<void>;
}

export namespace DeleteOrderRepository {
  export type Input = { id: number; storeId: number };
}
