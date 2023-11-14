import { Order } from "../../../models/order";

export interface FindOrdersRepository {
  findMany(input: FindOrdersRepository.Input): Promise<Order[]>;
}

export namespace FindOrdersRepository {
  export type Input = { storeId: number; customerId?: number };
}
