"use client";

import { CopyIcon, EyeIcon, MoreHorizontalIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { DropdownMenu } from "@/components/ui/dropdown-menu";

import { CustomerColumn } from "./column";

type CellActionProps = {
  data: CustomerColumn;
};

export const CellAction = ({ data }: CellActionProps) => {
  const router = useRouter();
  const params = useParams();

  const handleCopy = (id: number) => {
    navigator.clipboard.writeText(String(id));
    toast.success(" ID copiado para a área de transferência");
  };

  const handleViewOrdersClick = () => {
    router.push(`/${params.storeId}/customers/${data.id}`);
  };

  return (
    <>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <Button variant="ghost">
            <MoreHorizontalIcon />
            <span className="sr-only">Abrir Menu</span>
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content align="end">
          <DropdownMenu.Label>Ações</DropdownMenu.Label>
          <DropdownMenu.Item onClick={handleViewOrdersClick}>
            <EyeIcon className="mr-2 w-4 h-4" />
            Ver Pedidos
          </DropdownMenu.Item>
          <DropdownMenu.Item onClick={() => handleCopy(data.id)}>
            <CopyIcon className="mr-2 w-4 h-4" />
            Copiar Id
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </>
  );
};
