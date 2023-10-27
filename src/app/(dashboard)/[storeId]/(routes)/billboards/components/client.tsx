"use client";

import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { ApiList } from "@/components/ui/api-list";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

import { BillboardColumn, columns } from "./column";

type BillboardClientProps = {
  data: BillboardColumn[];
};

export const BillboardClient = ({ data }: BillboardClientProps) => {
  const router = useRouter();
  const params = useParams();
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={`Capas (${data.length})`} description="Faça a gestão de capas para a sua loja" />
        <Button className="capitalize" asChild>
          <Link href={`/${params.storeId}/billboards/new`}>
            <PlusIcon className="mr-2 w-4 h-4" />
            Adicionar
          </Link>
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={data} searchKey="label" />
      <Separator />
      <Heading title="API" description="API de Capas" />
      <ApiList entityId="billboardId" entityName="billboards" />
    </>
  );
};
