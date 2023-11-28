export interface CheckProductHasOrdersRepository {
  checkHasOrders(input: CheckProductHasOrdersRepository.Input): Promise<boolean>;
}

export namespace CheckProductHasOrdersRepository {
  export type Input = { storeId: number; productId: number };
}
