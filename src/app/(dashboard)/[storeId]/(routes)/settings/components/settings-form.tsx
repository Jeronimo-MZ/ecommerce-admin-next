"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Store } from "@prisma/client";
import { isAxiosError } from "axios";
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

type SettingsForm = {
  initialData: Store;
};

const settingsFormSchema = z.object({ name: z.string() });

type SettingsFormData = z.infer<typeof settingsFormSchema>;
export const SettingsForm = ({ initialData }: SettingsForm) => {
  const params = useParams();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const form = useForm<SettingsFormData>({ resolver: zodResolver(settingsFormSchema), defaultValues: initialData });
  const handleSubmitForm = async ({ name }: SettingsFormData) => {
    try {
      await api.patch(`/api/stores/${params.storeId}`, { name });
      router.refresh();
      toast.success("Updated successfully");
    } catch (error) {
      const errorMessage = handleAxiosError(error);
      toast.error(errorMessage);
    }
  };

  const handleDeleteStore = async () => {
    try {
      setIsDeleting(true);
      await api.delete(`/api/stores/${params.storeId}`);
      toast.success("Store deleted");
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
        <Heading title="Settings" description="Manage store preferences" />
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
          <div className="grid grid-cols-3 gap-8">
            <Form.Field
              control={form.control}
              name="name"
              render={({ field }) => (
                <Form.Item>
                  <Form.Label>Name</Form.Label>
                  <Form.Control>
                    <Input placeholder="Store name" disabled={form.formState.isSubmitting} {...field} />
                  </Form.Control>
                </Form.Item>
              )}
            />
          </div>
          <Button loading={form.formState.isSubmitting}>Save Changes</Button>
        </form>
      </Form.Provider>
    </>
  );
};
