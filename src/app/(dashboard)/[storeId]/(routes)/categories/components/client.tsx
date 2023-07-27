"use client";

import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { ApiList } from "@/components/ui/api-list";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

import { CategoryColumn, columns } from "./column";

type CategoryClientProps = {
  data: CategoryColumn[];
};

export const CategoryClient = ({ data }: CategoryClientProps) => {
  const params = useParams();
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={`Categories (${data.length})`} description="Manage categories for your store" />
        <Button className="capitalize" asChild>
          <Link href={`/${params.storeId}/categories/new`}>
            <PlusIcon className="mr-2 w-4 h-4" />
            Add new
          </Link>
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={data} searchKey="name" />
      <Separator />
      <Heading title="API" description="API calls for categories" />
      <ApiList entityId="categoryId" entityName="categories" />
    </>
  );
};
