"use client";

import { boolean } from "zod";

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
      <Modal title="Are you sure?" description="This action cannot be undone." isOpen={isOpen} onClose={onClose}>
        <div className="pt-6 space-x-2 flex items-center justify-end w-full">
          <Button disabled={loading} onClick={onClose} variant="outline">
            Cancel
          </Button>
          <Button loading={loading} variant="destructive" onClick={onConfirm}>
            Confirm
          </Button>
        </div>
      </Modal>
    </BaseClientProvider>
  );
};
