"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { z } from "zod";

import { AlertModal } from "@/components/modals/alert-modal";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { api } from "@/lib/axios";
import { handleAxiosError } from "@/utils/handle-axios-error";

const SizeFormSchema = z.object({
  name: z.string().min(1, "name is required"),
  value: z.string().min(1, "size is required"),
});

type SizeFormData = z.infer<typeof SizeFormSchema>;

type SizeFormProps = {
  initialData: SizeFormData | null;
};
export const SizeForm = ({ initialData }: SizeFormProps) => {
  const params = useParams();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const form = useForm<SizeFormData>({
    resolver: zodResolver(SizeFormSchema),
    defaultValues: initialData || {
      name: "",
      value: "",
    },
  });

  const title = initialData ? "Editar Tamanho" : "Criar Tamanho";
  const description = initialData ? "Editar um tamanho" : "Adicionar um novo tamanho";
  const toastMessage = initialData ? "Tamanho Actualizado." : "Tamanho criado.";
  const action = initialData ? "Salvar Mudanças" : "Criar";

  const handleSubmitForm = async (data: SizeFormData) => {
    try {
      if (initialData) {
        await api.patch(`/api/${params.storeId}/sizes/${params.sizeId}`, data);
        router.refresh();
      } else {
        await api.post(`/api/${params.storeId}/sizes`, data);
        router.push(`/${params.storeId}/sizes`);
      }
      toast.success(toastMessage);
    } catch (error) {
      const errorMessage = handleAxiosError(error);
      toast.error(errorMessage);
    }
  };

  const handleDeleteSize = async () => {
    try {
      setIsDeleting(true);
      await api.delete(`/api/${params.storeId}/sizes/${params.sizeId}`);
      toast.success("Tamanho deletado");
      router.push(`/${params.storeId}/sizes`);
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
        onConfirm={handleDeleteSize}
        loading={isDeleting}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {!!initialData && (
          <Button
            variant="destructive"
            size="sm"
            disabled={form.formState.isSubmitting}
            loading={isDeleting}
            onClick={() => setIsDeleteModalOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form.Provider {...form}>
        <form onSubmit={form.handleSubmit(handleSubmitForm)} className="space-y-8 w-full">
          <div className="grid grid-cols-3 gap-8">
            <Form.Field
              control={form.control}
              name="name"
              render={({ field }) => (
                <Form.Item>
                  <Form.Label>Nome</Form.Label>
                  <Form.Control>
                    <Input placeholder="Nome do Tamanho" disabled={form.formState.isSubmitting} {...field} />
                  </Form.Control>
                  <Form.Message />
                </Form.Item>
              )}
            />
            <Form.Field
              control={form.control}
              name="value"
              render={({ field }) => (
                <Form.Item>
                  <Form.Label>Abreviatura</Form.Label>
                  <Form.Control>
                    <Input placeholder="sm, md,..." disabled={form.formState.isSubmitting} {...field} />
                  </Form.Control>
                  <Form.Message />
                </Form.Item>
              )}
            />
          </div>
          <Button type="submit" loading={form.formState.isSubmitting} className="capitalize">
            {action}
          </Button>
        </form>
      </Form.Provider>
    </>
  );
};
