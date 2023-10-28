"use client";

import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { ApiList } from "@/components/ui/api-list";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

import { ColorColumn, columns } from "./column";

type ColorClientProps = {
  data: ColorColumn[];
};

export const ColorClient = ({ data }: ColorClientProps) => {
  const params = useParams();
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={`Cores (${data.length})`} description="Faça Gestão de cores da sua loja" />
        <Button className="capitalize" asChild>
          <Link href={`/${params.storeId}/colors/new`}>
            <PlusIcon className="mr-2 w-4 h-4" />
            Adicionar
          </Link>
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={data} searchKey="name" />
      <Separator />
      <Heading title="API" description="API de cores" />
      <ApiList entityId="colorId" entityName="colors" />
    </>
  );
};
