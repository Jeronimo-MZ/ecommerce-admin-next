"use client";

import { BaseClientProvider } from "@/providers/base-client-provider";

import { Button } from "../ui/button";
import { Modal } from "../ui/modal";

type AlertModalProps = {
  isOpen: boolean;
  onConfirm: () => void;
  onClose: () => void;
  loading?: boolean;
};

export const AlertModal = ({ isOpen, onConfirm, loading = false, onClose }: AlertModalProps) => {
  return (
    <BaseClientProvider>
      <Modal
        title="Você tem certeza?"
        description="Esta acção não pode ser desfeita."
        isOpen={isOpen}
        onClose={onClose}
      >
        <div className="pt-6 space-x-2 flex items-center justify-end w-full">
          <Button disabled={loading} onClick={onClose} variant="outline">
            Cancelar
          </Button>
          <Button loading={loading} variant="destructive" onClick={onConfirm}>
            Confirmar
          </Button>
        </div>
      </Modal>
    </BaseClientProvider>
  );
};
