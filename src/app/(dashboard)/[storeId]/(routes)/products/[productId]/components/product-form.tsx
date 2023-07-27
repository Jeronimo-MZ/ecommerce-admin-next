"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Category, Color, Product, ProductImage, Size } from "@prisma/client";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { z } from "zod";

import { AlertModal } from "@/components/modals/alert-modal";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form } from "@/components/ui/form";
import { Heading } from "@/components/ui/heading";
import { ImageUpload } from "@/components/ui/image-upload";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { api } from "@/lib/axios";
import { handleAxiosError } from "@/utils/handle-axios-error";

type ProductFormProps = {
  initialData: (Omit<Product, "price"> & { images: ProductImage[]; price: number }) | null;
  categories: Category[];
  sizes: Size[];
  colors: Color[];
};

const ProductFormSchema = z.object({
  name: z.string().min(1, "label is required"),
  images: z.object({ url: z.string().url() }).array().min(1, "product must have at least one image"),
  price: z.number().min(0),
  categoryId: z.string().uuid("category is required"),
  colorId: z.string().uuid("color is required"),
  sizeId: z.string().uuid("size is required"),
  isFeatured: z.boolean().default(false).optional(),
  isArchived: z.boolean().default(false).optional(),
});

type ProductFormData = z.infer<typeof ProductFormSchema>;
export const ProductForm = ({ initialData, categories, colors, sizes }: ProductFormProps) => {
  const params = useParams();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const form = useForm<ProductFormData>({
    resolver: zodResolver(ProductFormSchema),
    defaultValues: initialData
      ? { ...initialData }
      : {
          images: [],
          name: "",
          categoryId: "",
          colorId: "",
          price: 0,
          sizeId: "",
          isArchived: false,
          isFeatured: false,
        },
  });

  const title = initialData ? "Edit product" : "Create product";
  const description = initialData ? "Edit a product" : "Add a new product";
  const toastMessage = initialData ? "Product updated." : "Product created.";
  const action = initialData ? "Save changes" : "Create";

  const handleSubmitForm = async (data: ProductFormData) => {
    try {
      if (initialData) {
        await api.patch(`/api/${params.storeId}/products/${params.productId}`, data);
        router.refresh();
      } else {
        await api.post(`/api/${params.storeId}/products`, data);
        router.push(`/${params.storeId}/products`);
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
      toast.success("Product deleted");
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
                <Form.Label>Background Image</Form.Label>
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
                  <Form.Label>Name</Form.Label>
                  <Form.Control>
                    <Input placeholder="Product Name" disabled={form.formState.isSubmitting} {...field} />
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
                  <Form.Label>Price</Form.Label>
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
                  <Form.Label>Category</Form.Label>
                  <Select.Root
                    disabled={form.formState.isSubmitting}
                    value={field.value}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <Form.Control>
                      <Select.Trigger>
                        <Select.Value defaultValue={field.value} placeholder="Select a Category" />
                      </Select.Trigger>
                    </Form.Control>
                    <Select.Content>
                      {categories.map(category => (
                        <Select.Item key={category.id} value={category.id}>
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
                  <Form.Label>Size</Form.Label>
                  <Select.Root
                    disabled={form.formState.isSubmitting}
                    value={field.value}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <Form.Control>
                      <Select.Trigger>
                        <Select.Value defaultValue={field.value} placeholder="Select a Size" />
                      </Select.Trigger>
                    </Form.Control>
                    <Select.Content>
                      {sizes.map(size => (
                        <Select.Item key={size.id} value={size.id}>
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
                  <Form.Label>Color</Form.Label>
                  <Select.Root
                    disabled={form.formState.isSubmitting}
                    value={field.value}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <Form.Control>
                      <Select.Trigger>
                        <Select.Value defaultValue={field.value} placeholder="Select a Category" />
                      </Select.Trigger>
                    </Form.Control>
                    <Select.Content>
                      {colors.map(color => (
                        <Select.Item key={color.id} value={color.id}>
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
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
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
          </div>
          <Button type="submit" loading={form.formState.isSubmitting} className="capitalize">
            {action}
          </Button>
        </form>
      </Form.Provider>
    </>
  );
};
