"use client";

import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { ApiList } from "@/components/ui/api-list";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

import { columns, SizeColumn } from "./column";

type SizeClientProps = {
  data: SizeColumn[];
};

export const SizeClient = ({ data }: SizeClientProps) => {
  const params = useParams();
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={`Tamanhos (${data.length})`} description="Faça gestão dos tamanhos da sua loja" />
        <Button className="capitalize" asChild>
          <Link href={`/${params.storeId}/sizes/new`}>
            <PlusIcon className="mr-2 w-4 h-4" />
            Adicionar
          </Link>
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={data} searchKey="name" />
      <Separator />
      <Heading title="API" description="API de Tamanhos" />
      <ApiList entityId="sizeId" entityName="sizes" />
    </>
  );
};
