import dayjs from "dayjs";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { formatMoney } from "@/utils/format-money";

import { OrderRepository } from "../../../../../../server/repositories/order-repository";
import { StoreRepository } from "../../../../../../server/repositories/store-repository";
import { OrderClient } from "./components/client";
import { OrderColumn } from "./components/column";

type OrdersPageProps = {
  params: { storeId: string };
};

const OrdersPage = async ({ params }: OrdersPageProps) => {
  const orderRepository = new OrderRepository();
  const storeRepository = new StoreRepository();
  const store = await storeRepository.findOne({ id: Number(params.storeId) });
  if (!store) redirect("/");

  const orders = await orderRepository.findMany({ storeId: store.id });
  const formattedOrders: OrderColumn[] = orders.map(order => ({
    id: order.id,
    status: order.status,
    customerName: order.customer?.name ?? "",
    totalPrice: formatMoney(order.totalInCents / 100, store.currency),
    customerEmail: order.customer?.email ?? "",
    shippingAddress: order.shippingAddress ?? "",
    paymentDate: order.paymentDate ? dayjs(order.paymentDate).format("DD/MM/YYYY") : "",
    createdAt: dayjs(order.createdAt).format("DD/MM/YYYY"),
  }));
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <OrderClient data={formattedOrders} />
      </div>
    </div>
  );
};

export default OrdersPage;
