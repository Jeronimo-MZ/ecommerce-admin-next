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
        <Heading title={`Billboards (${data.length})`} description="Manage billboards for your store" />
        <Button className="capitalize" asChild>
          <Link href={`/${params.storeId}/billboards/new`}>
            <PlusIcon className="mr-2 w-4 h-4" />
            Add new
          </Link>
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={data} searchKey="label" />
      <Separator />
      <Heading title="API" description="API calls for billboards" />
      <ApiList entityId="billboardId" entityName="billboards" />
    </>
  );
};
