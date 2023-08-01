"use client";

import { CopyIcon, EditIcon, EyeIcon, MoreHorizontalIcon, TrashIcon } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";

import { AlertModal } from "@/components/modals/alert-modal";
import { Button } from "@/components/ui/button";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { api } from "@/lib/axios";
import { handleAxiosError } from "@/utils/handle-axios-error";

import { OrderColumn } from "./column";

type CellActionProps = {
  data: OrderColumn;
};

export const CellAction = ({ data }: CellActionProps) => {
  const router = useRouter();
  const params = useParams();

  const handleCopy = (billboardId: string) => {
    navigator.clipboard.writeText(billboardId);
    toast.success("Billboard ID copied to the clipboard");
  };

  const handleUpdateClick = () => {
    router.push(`/${params.storeId}/billboards/${data.id}`);
  };

  return (
    <>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <Button variant="ghost">
            <MoreHorizontalIcon />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content align="end">
          <DropdownMenu.Label>Actions</DropdownMenu.Label>
          <Link href={`/${params.storeId}/orders/${data.id}`}>
            <DropdownMenu.Item>
              <EyeIcon className="mr-2 w-4 h-4" />
              See More
            </DropdownMenu.Item>
          </Link>
          <DropdownMenu.Item onClick={() => handleCopy(data.id)}>
            <CopyIcon className="mr-2 w-4 h-4" />
            Copy Id
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </>
  );
};
