"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { z } from "zod";

import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { useStoreModal } from "@/hooks/use-store-modal";
import { api } from "@/lib/axios";
import { handleAxiosError } from "@/utils/handle-axios-error";

import { Button } from "../ui/button";

const formSchema = z.object({
  name: z.string().min(1, "must contain at least 1 character"),
});

type FormData = z.infer<typeof formSchema>;
export const StoreModal = () => {
  const storeModal = useStoreModal();
  const router = useRouter();
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "" },
  });

  const handleCreateStore = async ({ name }: FormData) => {
    try {
      const { data } = await api.post<{ storeId: string }>("/api/stores", { name });
      router.push(`/${data.storeId}`);
      storeModal.onClose();
    } catch (error) {
      const errorMessage = handleAxiosError(error);
      toast.error(errorMessage);
    }
  };

  return (
    <Modal
      title="Create Store"
      description="Add a new Store to manage products and categories!"
      isOpen={storeModal.isOpen}
      onClose={storeModal.onClose}
    >
      <div className="space-y-4 pt-2 pb-4">
        <Form.Provider {...form}>
          <form onSubmit={form.handleSubmit(handleCreateStore)}>
            <Form.Field
              control={form.control}
              name="name"
              render={({ field }) => (
                <Form.Item>
                  <Form.Label aria-required>Name</Form.Label>
                  <Form.Control>
                    <Input placeholder="E-commerce" {...field} disabled={form.formState.isSubmitting} />
                  </Form.Control>
                  <Form.Message />
                </Form.Item>
              )}
            />
            <div className="pt-6 space-x-2 flex items-center justify-end w-full">
              <Button
                type="button"
                variant="outline"
                onClick={storeModal.onClose}
                disabled={form.formState.isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" loading={form.formState.isSubmitting}>
                Continue
              </Button>
            </div>
          </form>
        </Form.Provider>
      </div>
    </Modal>
  );
};
