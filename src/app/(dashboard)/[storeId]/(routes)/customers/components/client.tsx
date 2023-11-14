"use client";

import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

import { columns, CustomerColumn } from "./column";

type CategoryClientProps = {
  data: CustomerColumn[];
};

export const CustomerClient = ({ data }: CategoryClientProps) => {
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={`Clientes (${data.length})`} description="Veja os Clientes da sua loja" />
      </div>
      <Separator />
      <DataTable columns={columns} data={data} searchKey="name" />
    </>
  );
};
