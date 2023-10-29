import { OrderWithItems } from "../../../models/order";

export interface PayOrderRepository {
  pay(input: PayOrderRepository.Input): Promise<OrderWithItems>;
}

export namespace PayOrderRepository {
  export type Input = {
    id: number;
    shippingAddress: string;
    customerEmail: string;
    customerName: string;
    paymentId: string;
    paymentDate: Date;
    storeId: number;
  };
}
