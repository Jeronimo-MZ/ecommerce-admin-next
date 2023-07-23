"use client";

import { Dialog } from "@/components/ui/dialog";

type ModalProps = {
  title: string;
  description: string;
  isOpen: boolean;
  onClose: () => void;
};

export const Modal = ({ description, isOpen, onClose, title, children }: React.PropsWithChildren<ModalProps>) => {
  const onChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onChange}>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>{title}</Dialog.Title>
          <Dialog.Description>{description}</Dialog.Description>
        </Dialog.Header>
        <div>{children}</div>
      </Dialog.Content>
    </Dialog.Root>
  );
};
