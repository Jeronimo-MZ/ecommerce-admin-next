import dayjs from "dayjs";
import { notFound, redirect } from "next/navigation";

import { formatMoney } from "@/utils/format-money";

import { CustomerRepository } from "../../../../../../../server/repositories/customer-repository";
import { OrderRepository } from "../../../../../../../server/repositories/order-repository";
import { StoreRepository } from "../../../../../../../server/repositories/store-repository";
import { OrderColumn } from "../../orders/components/column";
import { CustomerOrdersClient } from "./components/client";

type CustomerOrdersPageProps = {
  params: { storeId: string; customerId: string };
};

const CustomerOrdersPage = async ({ params }: CustomerOrdersPageProps) => {
  const orderRepository = new OrderRepository();
  const customerRepository = new CustomerRepository();
  const storeRepository = new StoreRepository();
  const store = await storeRepository.findOne({ id: Number(params.storeId) });
  if (!store) redirect("/");
  const customer = await customerRepository.findOne({ storeId: store.id, customerId: Number(params.customerId) });
  if (!customer) notFound();

  const orders = await orderRepository.findMany({ storeId: store.id, customerId: customer.id });
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
        <CustomerOrdersClient data={formattedOrders} customerName={customer.name} />
      </div>
    </div>
  );
};

export default CustomerOrdersPage;
