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
import { Select } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { api } from "@/lib/axios";
import { handleAxiosError } from "@/utils/handle-axios-error";

import { Category } from "../../../../../../../../server/models/category";
import { Color } from "../../../../../../../../server/models/color";
import { Product } from "../../../../../../../../server/models/product";
import { Size } from "../../../../../../../../server/models/size";

type ProductFormProps = {
  initialData: Product | null;
  categories: Category[];
  sizes: Size[];
  colors: Color[];
};

const ProductFormSchema = z.object({
  name: z.string().min(1, "Campo obrigatório"),
  images: z.object({ url: z.string().url() }).array().min(1, "Deve ter pelo menos uma imagem"),
  price: z.number({ required_error: "Campo Obrigatório" }).min(0),
  quantityInStock: z.number({ required_error: "Campo Obrigatório" }).min(0),
  categoryId: z.coerce.number({ required_error: "Campo Obrigatório" }),
  colorId: z.coerce.number({ required_error: "Campo Obrigatório" }),
  sizeId: z.coerce.number({ required_error: "Campo Obrigatório" }),
});

type ProductFormData = z.infer<typeof ProductFormSchema>;
export const ProductForm = ({ initialData, categories, colors, sizes }: ProductFormProps) => {
  const params = useParams();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const form = useForm<ProductFormData>({
    resolver: zodResolver(ProductFormSchema),
    defaultValues: {
      name: initialData?.name ?? "",
      images: initialData?.images.map(url => ({ url })) ?? [],
      price: initialData?.price ?? 0,
      categoryId: initialData?.category.id ?? undefined,
      colorId: initialData?.color.id ?? undefined,
      sizeId: initialData?.size.id ?? undefined,
      quantityInStock: initialData?.quantityInStock ?? 0,
    },
  });

  const title = initialData ? "Editar Produto" : "Criar produto";
  const description = initialData ? "Editar um produto" : "Adicionar um novo produto";
  const toastMessage = initialData ? "Produto actualizado." : "Produto Criado.";
  const action = initialData ? "Salvar Mudanças" : "Criar";

  const handleSubmitForm = async (data: ProductFormData) => {
    try {
      const priceInCents = data.price * 100;
      if (initialData) {
        await api.patch(`/api/${params.storeId}/products/${params.productId}`, { ...data, priceInCents });
        router.refresh();
      } else {
        await api.post(`/api/${params.storeId}/products`, { ...data, priceInCents });
        router.push(`/${params.storeId}/products`);
        router.refresh();
      }
      toast.success(toastMessage);
    } catch (error) {
      const errorMessage = handleAxiosError(error);
      toast.error(errorMessage);
    }
  };

  const handleDeleteProduct = async () => {
    try {
      setIsDeleting(true);
      await api.delete(`/api/${params.storeId}/products/${params.productId}`);
      toast.success("Produto deletado");
      router.push(`/${params.storeId}/products`);
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
        onConfirm={handleDeleteProduct}
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
            name="images"
            render={({ field }) => (
              <Form.Item>
                <Form.Label>Imagens</Form.Label>
                <Form.Control>
                  <ImageUpload
                    value={field.value.map(image => image.url)}
                    onChange={url => field.onChange([...field.value, { url }])}
                    onRemove={url => field.onChange(field.value.filter(item => item.url !== url))}
                  />
                </Form.Control>
                <Form.Message />
              </Form.Item>
            )}
          />
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
            <Form.Field
              control={form.control}
              name="name"
              render={({ field }) => (
                <Form.Item>
                  <Form.Label>Nome</Form.Label>
                  <Form.Control>
                    <Input placeholder="Nome do Produto" disabled={form.formState.isSubmitting} {...field} />
                  </Form.Control>
                  <Form.Message />
                </Form.Item>
              )}
            />
            <Form.Field
              control={form.control}
              name="price"
              render={({ field }) => (
                <Form.Item>
                  <Form.Label>Preço</Form.Label>
                  <Form.Control>
                    <Input
                      placeholder="9.99"
                      type="number"
                      step={0.01}
                      disabled={form.formState.isSubmitting}
                      {...field}
                      onChange={event => field.onChange(Number(event.target.value))}
                    />
                  </Form.Control>
                  <Form.Message />
                </Form.Item>
              )}
            />
            <Form.Field
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <Form.Item>
                  <Form.Label>Categoria</Form.Label>
                  <Select.Root
                    disabled={form.formState.isSubmitting}
                    value={String(field.value)}
                    onValueChange={field.onChange}
                    defaultValue={String(field.value)}
                  >
                    <Form.Control>
                      <Select.Trigger>
                        <Select.Value defaultValue={field.value} placeholder="Seleccione uma Categoria" />
                      </Select.Trigger>
                    </Form.Control>
                    <Select.Content>
                      {categories.map(category => (
                        <Select.Item key={category.id} value={String(category.id)}>
                          {category.name}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                  <Form.Message />
                </Form.Item>
              )}
            />
            <Form.Field
              control={form.control}
              name="sizeId"
              render={({ field }) => (
                <Form.Item>
                  <Form.Label>Tamanho</Form.Label>
                  <Select.Root
                    disabled={form.formState.isSubmitting}
                    value={String(field.value)}
                    onValueChange={field.onChange}
                    defaultValue={String(field.value)}
                  >
                    <Form.Control>
                      <Select.Trigger>
                        <Select.Value defaultValue={String(field.value)} placeholder="Seleccione um Tamanho" />
                      </Select.Trigger>
                    </Form.Control>
                    <Select.Content>
                      {sizes.map(size => (
                        <Select.Item key={size.id} value={String(size.id)}>
                          {size.name}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                  <Form.Message />
                </Form.Item>
              )}
            />
            <Form.Field
              control={form.control}
              name="colorId"
              render={({ field }) => (
                <Form.Item>
                  <Form.Label>Cor</Form.Label>
                  <Select.Root
                    disabled={form.formState.isSubmitting}
                    value={String(field.value)}
                    onValueChange={field.onChange}
                    defaultValue={String(field.value)}
                  >
                    <Form.Control>
                      <Select.Trigger>
                        <Select.Value defaultValue={field.value} placeholder="Seleccione uma Cor" />
                      </Select.Trigger>
                    </Form.Control>
                    <Select.Content>
                      {colors.map(color => (
                        <Select.Item key={color.id} value={String(color.id)}>
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full border" style={{ backgroundColor: color.value }} />
                            {color.name}
                          </div>
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                  <Form.Message />
                </Form.Item>
              )}
            />
            <Form.Field
              control={form.control}
              name="quantityInStock"
              render={({ field }) => (
                <Form.Item>
                  <Form.Label>Quantidade em Stock</Form.Label>
                  <Form.Control>
                    <Input
                      placeholder="10"
                      type="number"
                      step={1}
                      disabled={form.formState.isSubmitting}
                      {...field}
                      onChange={event => field.onChange(Number(event.target.value))}
                    />
                  </Form.Control>
                  <Form.Message />
                </Form.Item>
              )}
            />
          </div>
          {/* <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
            <Form.Field
              control={form.control}
              name="isFeatured"
              render={({ field }) => (
                <Form.Item className="flex flex-row items-start space-x-3 space-y-0  rounded-md border p-4">
                  <Form.Control>
                    <Checkbox checked={field.value} onCheckedChange={checked => field.onChange(checked)} />
                  </Form.Control>
                  <div className="space-y-1 leading-none">
                    <Form.Label>Featured</Form.Label>
                    <Form.Description>This product will appear on the home page</Form.Description>
                  </div>
                </Form.Item>
              )}
            />
            <Form.Field
              control={form.control}
              name="isArchived"
              render={({ field }) => (
                <Form.Item className="flex flex-row items-start space-x-3 space-y-0  rounded-md border p-4">
                  <Form.Control>
                    <Checkbox checked={field.value} onCheckedChange={checked => field.onChange(checked)} />
                  </Form.Control>
                  <div className="space-y-1 leading-none">
                    <Form.Label>Archived</Form.Label>
                    <Form.Description>This product will not appear anywhere in the store.</Form.Description>
                  </div>
                </Form.Item>
              )}
            />
          </div> */}
          <Button type="submit" loading={form.formState.isSubmitting} className="capitalize">
            {action}
          </Button>
        </form>
      </Form.Provider>
    </>
  );
};
