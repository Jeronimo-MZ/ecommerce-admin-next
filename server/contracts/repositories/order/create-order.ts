import { Order } from "../../../models/order";

export interface CreateOrderRepository {
  create(input: CreateOrderRepository.Input): Promise<Order>;
}

export namespace CreateOrderRepository {
  export type Input = {
    storeId: number;
    items: Array<{
      productId: number;
      quantity: number;
    }>;
  };
}
