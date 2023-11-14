"use client";

import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

import { columns, OrderColumn } from "../../../orders/components/column";

type OrderClientProps = {
  data: OrderColumn[];
  customerName: string;
};

export const CustomerOrdersClient = ({ data, customerName }: OrderClientProps) => {
  return (
    <>
      <Heading
        title={`Pedidos de ${customerName} (${data.length})`}
        description={`Faça gestão dos pedidos de ${customerName}`}
      />
      <Separator />
      <DataTable columns={columns} data={data} searchKey="customerEmail" />
      <Separator />
    </>
  );
};
