"use client";

import { ApiList } from "@/components/ui/api-list";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

import { columns, OrderColumn } from "./column";

type OrderClientProps = {
  data: OrderColumn[];
};

export const OrderClient = ({ data }: OrderClientProps) => {
  return (
    <>
      <Heading title={`Pedidos (${data.length})`} description="Faça gestão dos pedidos da sua Loja" />
      <Separator />
      <DataTable columns={columns} data={data} searchKey="customerEmail" />
      <Separator />
      <Heading title="API" description="API de Pedidos" />
      <ApiList entityId="orderId" entityName="orders" />
    </>
  );
};
