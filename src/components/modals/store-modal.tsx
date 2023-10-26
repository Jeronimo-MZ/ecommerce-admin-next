"use client";

import { zodResolver } from "@hookform/resolvers/zod";
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
import { Select } from "../ui/select";

const formSchema = z.object({
  name: z.string().nonempty("Campo Obrigatório"),
  url: z.string().nonempty("Campo Obrigatório").url("Deve ser uma URL válida"),
  currency: z.string().nonempty("Campo Obrigatório"),
});

type FormData = z.infer<typeof formSchema>;
export const StoreModal = () => {
  const storeModal = useStoreModal();
  const router = useRouter();
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const handleCreateStore = async ({ name, currency, url }: FormData) => {
    try {
      const { data } = await api.post<{ storeId: string }>("/api/stores", { name, currency, url });
      router.push(`/${data.storeId}`);
      storeModal.onClose();
    } catch (error) {
      const errorMessage = handleAxiosError(error);
      toast.error(errorMessage);
    }
  };

  return (
    <Modal
      title="Criar Loja"
      description="Adicione uma nova Loja para gerir seus produtos e categorias!"
      isOpen={storeModal.isOpen}
      onClose={storeModal.onClose}
    >
      <div className="space-y-4 pt-2 pb-4">
        <Form.Provider {...form}>
          <form onSubmit={form.handleSubmit(handleCreateStore)} className="space-y-4">
            <Form.Field
              control={form.control}
              name="name"
              render={({ field }) => (
                <Form.Item>
                  <Form.Label aria-required>Nome</Form.Label>
                  <Form.Control>
                    <Input placeholder="E-commerce" {...field} disabled={form.formState.isSubmitting} />
                  </Form.Control>
                  <Form.Message />
                </Form.Item>
              )}
            />
            <Form.Field
              control={form.control}
              name="url"
              render={({ field }) => (
                <Form.Item>
                  <Form.Label aria-required>Url do Cliente (Front-end)</Form.Label>
                  <Form.Control>
                    <Input placeholder="https://loja.co.mz" {...field} disabled={form.formState.isSubmitting} />
                  </Form.Control>
                  <Form.Message />
                </Form.Item>
              )}
            />
            <Form.Field
              control={form.control}
              name="currency"
              render={({ field }) => (
                <Form.Item>
                  <Form.Label aria-required>Moeda Utilizada</Form.Label>
                  <Select.Root
                    disabled={form.formState.isSubmitting}
                    value={field.value}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <Form.Control>
                      <Select.Trigger>
                        <Select.Value defaultValue={field.value} placeholder="Selecione uma Moeda" />
                      </Select.Trigger>
                    </Form.Control>
                    <Select.Content>
                      <Select.Item value="MZN">MZN</Select.Item>
                      <Select.Item value="USD">USD</Select.Item>
                    </Select.Content>
                  </Select.Root>
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
                Cancelar
              </Button>
              <Button type="submit" loading={form.formState.isSubmitting}>
                Continuar
              </Button>
            </div>
          </form>
        </Form.Provider>
      </div>
    </Modal>
  );
};
