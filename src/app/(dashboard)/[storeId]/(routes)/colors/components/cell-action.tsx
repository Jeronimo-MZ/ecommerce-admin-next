"use client";

import { CopyIcon, EditIcon, MoreHorizontalIcon, TrashIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";

import { AlertModal } from "@/components/modals/alert-modal";
import { Button } from "@/components/ui/button";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { api } from "@/lib/axios";
import { handleAxiosError } from "@/utils/handle-axios-error";

import { ColorColumn } from "./column";

type CellActionProps = {
  data: ColorColumn;
};

export const CellAction = ({ data }: CellActionProps) => {
  const router = useRouter();
  const params = useParams();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleCopy = (id: number) => {
    navigator.clipboard.writeText(String(id));
    toast.success(" ID Copiado");
  };

  const handleUpdateClick = () => {
    router.push(`/${params.storeId}/colors/${data.id}`);
  };

  const handleDeleteColor = async () => {
    try {
      setIsDeleting(true);
      await api.delete(`/api/${params.storeId}/colors/${data.id}`);
      toast.success("Cor deletada");
      router.refresh();
    } catch (error) {
      const errorMessage = handleAxiosError(error);
      toast.error(errorMessage);
    } finally {
      setIsDeleteModalOpen(false);
      setIsDeleting(false);
    }
  };
  return (
    <>
      <AlertModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteColor}
        loading={isDeleting}
      />
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <Button variant="ghost">
            <MoreHorizontalIcon />
            <span className="sr-only">Abrir Menu</span>
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content align="end">
          <DropdownMenu.Label>Actions</DropdownMenu.Label>
          <DropdownMenu.Item onClick={handleUpdateClick}>
            <EditIcon className="mr-2 w-4 h-4" />
            Editar
          </DropdownMenu.Item>
          <DropdownMenu.Item onClick={() => handleCopy(data.id)}>
            <CopyIcon className="mr-2 w-4 h-4" />
            Copiar Id
          </DropdownMenu.Item>
          <DropdownMenu.Item onClick={() => setIsDeleteModalOpen(true)}>
            <TrashIcon className="mr-2 w-4 h-4" />
            Deletar
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </>
  );
};
