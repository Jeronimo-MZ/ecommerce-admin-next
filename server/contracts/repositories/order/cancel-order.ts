export interface CancelOrderRepository {
  cancel(input: CancelOrderRepository.Input): Promise<void>;
}

export namespace CancelOrderRepository {
  export type Input = { id: number; storeId: number };
}
