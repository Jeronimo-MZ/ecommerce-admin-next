export type Order = {
  id: number;
  status: string;
  shippingAddress?: string;
  customer?: {
    id: number;
    name: string;
    email: string;
  };
  paymentId?: string;
  paymentDate?: string;
  totalInCents: number;
  createdAt: Date;
  updatedAt: Date;
  storeId: number;
};

export type OrderItem = {
  orderId: number;
  productId: string;
  productName: string;
  price: number;
  quantity: number;
};

export type OrderWithItems = Order & { items: OrderItem[] };
