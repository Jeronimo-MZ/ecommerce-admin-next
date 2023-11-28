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
import { ImageUpload } from "@/components/ui/image-upload";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { api } from "@/lib/axios";
import { handleAxiosError } from "@/utils/handle-axios-error";

import { Billboard } from "../../../../../../../../server/models/billboard";

type BillboardFormProps = {
  initialData: Billboard | null;
};

const BillboardFormSchema = z.object({
  label: z.string().nonempty("Campo obrigatório"),
  imageUrl: z.string().url("Imagem inválida"),
});

type BillboardFormData = z.infer<typeof BillboardFormSchema>;
export const BillboardForm = ({ initialData }: BillboardFormProps) => {
  const params = useParams();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const form = useForm<BillboardFormData>({
    resolver: zodResolver(BillboardFormSchema),
    defaultValues: initialData || {
      label: "",
      imageUrl: "",
    },
  });

  const title = initialData ? "Editar Capa" : "Criar Capa";
  const description = initialData ? "Editar uma capa" : "Adicionar uma capa";
  const toastMessage = initialData ? "Capa actualizada." : "Capa criada.";
  const action = initialData ? "Salvar Mudanças" : "Criar";

  const handleSubmitForm = async ({ imageUrl, label }: BillboardFormData) => {
    try {
      if (initialData) {
        await api.patch(`/api/${params.storeId}/billboards/${params.billboardId}`, { imageUrl, label });
        router.refresh();
      } else {
        await api.post(`/api/${params.storeId}/billboards`, { imageUrl, label });
        router.push(`/${params.storeId}/billboards`);
        router.refresh();
      }
      toast.success(toastMessage);
    } catch (error) {
      const errorMessage = handleAxiosError(error);
      toast.error(errorMessage);
    }
  };

  const handleDeleteBillboard = async () => {
    try {
      setIsDeleting(true);
      await api.delete(`/api/${params.storeId}/billboards/${params.billboardId}`);
      toast.success("Capa Deletada");
      router.push(`/${params.storeId}/billboards`);
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
        onConfirm={handleDeleteBillboard}
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
          <Form.Field
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <Form.Item>
                <Form.Label>Imagem</Form.Label>
                <Form.Control>
                  <ImageUpload
                    value={field.value ? [field.value] : []}
                    onChange={url => field.onChange(url)}
                    onRemove={() => field.onChange("")}
                  />
                </Form.Control>
                <Form.Message />
              </Form.Item>
            )}
          />
          <div className="grid grid-cols-3 gap-8">
            <Form.Field
              control={form.control}
              name="label"
              render={({ field }) => (
                <Form.Item>
                  <Form.Label>Texto</Form.Label>
                  <Form.Control>
                    <Input placeholder="Texto da Capa" disabled={form.formState.isSubmitting} {...field} />
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
