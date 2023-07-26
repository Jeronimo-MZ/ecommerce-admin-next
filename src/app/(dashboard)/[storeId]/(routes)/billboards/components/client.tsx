"use client";

import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

export const BillboardClient = () => {
  const router = useRouter();
  const params = useParams();
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title="Billboards (0)" description="Manage billboards for your store" />
        <Button className="capitalize" asChild>
          <Link href={`/${params.storeId}/billboards/new`}>
            <PlusIcon className="mr-2 w-4 h-4" />
            Add new
          </Link>
        </Button>
      </div>
      <Separator />
    </>
  );
};
