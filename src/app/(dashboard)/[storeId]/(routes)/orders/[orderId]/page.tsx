import dayjs from "dayjs";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Select } from "@/components/ui/select";
import { formatMoney } from "@/utils/format-money";

import { OrderRepository } from "../../../../../../../server/repositories/order-repository";
import { StoreRepository } from "../../../../../../../server/repositories/store-repository";

type OrderPageProps = {
  params: {
    storeId: string;
    orderId: string;
  };
};

const Order = async ({ params }: OrderPageProps) => {
  const storeId = Number(params.storeId);
  const orderId = Number(params.orderId);
  const storeRepository = new StoreRepository();
  const orderRepository = new OrderRepository();
  const store = await storeRepository.findOne({ id: storeId });
  if (!store) redirect("/");
  const order = await orderRepository.findOne({ id: orderId, storeId });
  if (!order) notFound();
  return (
    <>
      <div className="flex items-center justify-between p-4">
        <Heading title={`Pedido #${order.id}`} description="Veja os detalhes do Pedido" />
      </div>
      <section className="grid grid-cols-4 px-4">
        <div className="col-span-1">
          <p>
            <span className="font-medium">Id:</span> {order.id}
          </p>
          <p className="my-1">
            <span className="font-medium">Date de Pedido: </span>
            {order?.createdAt ? dayjs(order.createdAt).format("DD/MM/YYYY") : "Ainda não especificado"}
          </p>
          <p className="my-1">
            <span className="font-medium">Nome do Cliente: </span>
            {order.customer?.name ?? "Ainda não especificado"}
          </p>
          <p className="my-1">
            <span className="font-medium">Email do cliente: </span>
            {order.customer?.email ?? "Ainda não especificado"}
          </p>
          <p className="my-1">
            <span className="font-medium">Endereço de entrega: </span>
            {order.shippingAddress ?? "Ainda não especificado"}
          </p>
          <p className="my-1">
            <span className="font-medium">Data de pagamento: </span>
            {order?.paymentDate ? dayjs(order.paymentDate).format("DD/MM/YYYY") : "Ainda não especificado"}
          </p>
          <p className="my-1">
            <span className="font-medium">Código de transação: </span>
            {order.paymentId ?? "Ainda não especificado"}
          </p>
          <p className="my-1">
            <span className="font-medium">Status: </span>
            {order.status}
          </p>
        </div>
        <div className="border px-4 pb-2 my-4 rounded col-span-2">
          <div className="grid grid-cols-4 mt-4 mb-2 border-b pb-2">
            <p className="col-span-2 font-medium">Nome do produto</p>
            <p className="col-span-1 font-medium">Quantidade</p>
            <p className="col-span-1 font-medium">Preço unitário</p>
          </div>
          {order.items.map(item => (
            <div key={item.productId} className="grid grid-cols-4">
              <p className="col-span-2 my-2 text-sm">
                <Link target="_blank" href={`/${storeId}/products/${item.productId}`}>
                  {item.productName}
                </Link>
              </p>
              <p className="col-span-1 my-2 text-sm">{item.quantity}</p>
              <p className="col-span-1 my-2 text-sm">{formatMoney(item.price / 100, store.currency)}</p>
            </div>
          ))}
          <div className="grid grid-cols-4 mt-4 mb-2 border-t">
            <p className="col-span-3 font-medium">Total </p>
            <p className="col-span-1 font-medium">{formatMoney(order.totalInCents / 100, store.currency)}</p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Order;
