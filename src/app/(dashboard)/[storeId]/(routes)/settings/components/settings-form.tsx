"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { z } from "zod";

import { AlertModal } from "@/components/modals/alert-modal";
import { ApiAlert } from "@/components/ui/api-alert";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useOrigin } from "@/hooks/use-origin";
import { api } from "@/lib/axios";
import { handleAxiosError } from "@/utils/handle-axios-error";

import { Store } from "../../../../../../../server/models/store";

type SettingsForm = {
  initialData: Store;
};

const settingsFormSchema = z.object({
  name: z.string().nonempty("Campo Obrigatório"),
  url: z.string().nonempty("Campo Obrigatório").url("Deve ser uma URL válida"),
  currency: z.string().nonempty("Campo Obrigatório"),
});

type SettingsFormData = z.infer<typeof settingsFormSchema>;
export const SettingsForm = ({ initialData }: SettingsForm) => {
  const params = useParams();
  const router = useRouter();
  const origin = useOrigin();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const form = useForm<SettingsFormData>({ resolver: zodResolver(settingsFormSchema), defaultValues: initialData });
  const handleSubmitForm = async ({ name, currency, url }: SettingsFormData) => {
    try {
      await api.patch(`/api/stores/${params.storeId}`, { name, currency, url });
      router.refresh();
      toast.success("Loja Actualizada");
    } catch (error) {
      const errorMessage = String(handleAxiosError(error));
      toast.error(errorMessage);
    }
  };

  const handleDeleteStore = async () => {
    try {
      setIsDeleting(true);
      await api.delete(`/api/stores/${params.storeId}`);
      toast.success("Loja Deletada");
      router.push("/");
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
        onConfirm={handleDeleteStore}
        loading={isDeleting}
      />
      <div className="flex items-center justify-between">
        <Heading title="Configurações" description="Faça gestão das configurações da sua loja" />
        <Button
          variant="destructive"
          size="sm"
          disabled={form.formState.isSubmitting}
          loading={isDeleting}
          onClick={() => setIsDeleteModalOpen(true)}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
      <Separator />
      <Form.Provider {...form}>
        <form onSubmit={form.handleSubmit(handleSubmitForm)} className="space-y-8 w-full">
          <div className="flex flex-col gap-4 items-start">
            <Form.Field
              control={form.control}
              name="name"
              render={({ field }) => (
                <Form.Item>
                  <Form.Label>Nome</Form.Label>
                  <Form.Control>
                    <Input placeholder="Nome da Loja" disabled={form.formState.isSubmitting} {...field} />
                  </Form.Control>
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
          </div>
          <Button loading={form.formState.isSubmitting}>Salvar Mudanças</Button>
        </form>
      </Form.Provider>
      <ApiAlert title="NEXT_PUBLIC_API_URL" description={`${origin}/api/${params.storeId}`} variant="public" />
    </>
  );
};
