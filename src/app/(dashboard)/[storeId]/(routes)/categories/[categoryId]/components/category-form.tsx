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
import { Select } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { api } from "@/lib/axios";
import { handleAxiosError } from "@/utils/handle-axios-error";

import { Billboard } from "../../../../../../../../server/models/billboard";

const CategoryFormSchema = z.object({
  name: z.string().min(1, "Campo obrigatório"),
  billboardId: z.coerce.number(),
});

type CategoryFormData = z.infer<typeof CategoryFormSchema>;

type CategoryFormProps = {
  initialData: CategoryFormData | null;
  billboards: Billboard[];
};
export const CategoryForm = ({ initialData, billboards }: CategoryFormProps) => {
  const params = useParams();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const form = useForm<CategoryFormData>({
    resolver: zodResolver(CategoryFormSchema),
    defaultValues: initialData || {
      name: "",
    },
  });

  const title = initialData ? "Editar categoria" : "Criar categoria";
  const description = initialData ? "Editar uma categoria" : "Adicionar uma nova categoria";
  const toastMessage = initialData ? "Categoria actualizada." : "Categoria criada.";
  const action = initialData ? "Salvar Mudanças" : "Criar";

  const handleSubmitForm = async (data: CategoryFormData) => {
    try {
      if (initialData) {
        await api.patch(`/api/${params.storeId}/categories/${params.categoryId}`, data);
        router.refresh();
      } else {
        await api.post(`/api/${params.storeId}/categories`, data);
        router.push(`/${params.storeId}/categories`);
      }
      toast.success(toastMessage);
    } catch (error) {
      const errorMessage = handleAxiosError(error);
      toast.error(errorMessage);
    }
  };

  const handleDeleteCategory = async () => {
    try {
      setIsDeleting(true);
      await api.delete(`/api/${params.storeId}/categories/${params.categoryId}`);
      toast.success("Categoria deletada");
      router.push(`/${params.storeId}/categories`);
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
        onConfirm={handleDeleteCategory}
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
                    <Input placeholder="Nome da Categoria" disabled={form.formState.isSubmitting} {...field} />
                  </Form.Control>
                  <Form.Message />
                </Form.Item>
              )}
            />
            <Form.Field
              control={form.control}
              name="billboardId"
              render={({ field }) => (
                <Form.Item>
                  <Form.Label>Capa</Form.Label>
                  <Select.Root
                    disabled={form.formState.isSubmitting}
                    value={String(field.value)}
                    onValueChange={field.onChange}
                    defaultValue={String(field.value)}
                  >
                    <Form.Control>
                      <Select.Trigger>
                        <Select.Value defaultValue={field.value} placeholder="Escolha uma capa" />
                      </Select.Trigger>
                    </Form.Control>
                    <Select.Content>
                      {billboards.map(billboard => (
                        <Select.Item key={billboard.id} value={String(billboard.id)}>
                          {billboard.label}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
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
