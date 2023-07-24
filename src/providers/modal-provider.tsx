import { StoreModal } from "@/components/modals/store-modal";

import { BaseClientProvider } from "./base-client-provider";

export const ModalProvider = () => {
  return (
    <BaseClientProvider>
      <StoreModal />
    </BaseClientProvider>
  );
};
