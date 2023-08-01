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
      <Heading title={`Orders (${data.length})`} description="Manage orders for your store" />
      <Separator />
      <DataTable columns={columns} data={data} searchKey="products" />
      <Separator />
      <Heading title="API" description="API calls for orders" />
      <ApiList entityId="orderId" entityName="orders" />
    </>
  );
};
