import { Toaster } from "react-hot-toast";

import { BaseClientProvider } from "./base-client-provider";

export const ToastProvider = () => {
  return (
    <BaseClientProvider>
      <Toaster />
    </BaseClientProvider>
  );
};
