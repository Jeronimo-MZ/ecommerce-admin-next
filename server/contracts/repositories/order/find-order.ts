import { OrderWithItems } from "../../../models/order";

export interface FindOrderRepository {
  findOne(input: FindOrderRepository.Input): Promise<OrderWithItems | null>;
}

export namespace FindOrderRepository {
  export type Input = { id: number; storeId: number };
}
