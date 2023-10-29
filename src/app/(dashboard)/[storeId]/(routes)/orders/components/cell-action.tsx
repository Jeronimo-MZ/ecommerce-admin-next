"use client";

import { CopyIcon, EyeIcon, MoreHorizontalIcon } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { DropdownMenu } from "@/components/ui/dropdown-menu";

import { OrderColumn } from "./column";

type CellActionProps = {
  data: OrderColumn;
};

export const CellAction = ({ data }: CellActionProps) => {
  const params = useParams();

  const handleCopy = (id: number) => {
    navigator.clipboard.writeText(String(id));
    toast.success("ID copiado para a área de transferência");
  };

  return (
    <>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <Button variant="ghost">
            <MoreHorizontalIcon />
            <span className="sr-only">Abrir menu</span>
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content align="end">
          <DropdownMenu.Label>Acções</DropdownMenu.Label>
          <Link href={`/${params.storeId}/orders/${data.id}`}>
            <DropdownMenu.Item>
              <EyeIcon className="mr-2 w-4 h-4" />
              Ver mais
            </DropdownMenu.Item>
          </Link>
          <DropdownMenu.Item onClick={() => handleCopy(data.id)}>
            <CopyIcon className="mr-2 w-4 h-4" />
            Copiar ID
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </>
  );
};
