import dayjs from "dayjs";

import { prisma } from "@/lib/prisma";
import { formatMoney } from "@/utils/format-money";

import { OrderClient } from "./components/client";
import { OrderColumn } from "./components/column";

type OrdersPageProps = {
  params: { storeId: string };
};

export const OrdersPage = async ({ params }: OrdersPageProps) => {
  const orders = await prisma.order.findMany({
    where: { storeId: params.storeId },
    orderBy: { createdAt: "asc" },
    include: { orderItems: { include: { product: true } } },
  });

  const formattedOrders: OrderColumn[] = orders.map(order => ({
    id: order.id,
    phone: order.phone ?? "",
    address: order.address ?? "",
    products: order.orderItems.map(item => item.product.name).join(", "),
    totalPrice: formatMoney(
      order.orderItems.reduce((total, item) => {
        return total + item.quantity * item.unitPrice.toNumber();
      }, 0),
    ),
    isPaid: !!order.paidAt,
    createdAt: dayjs(order.createdAt).format("MMMM D, YYYY"),
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
