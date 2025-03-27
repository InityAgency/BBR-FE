"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { API_BASE_URL, API_VERSION } from "@/app/constants/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { BrandType } from "@/app/types/models/BrandType";
import FormHeader from "@/components/admin/Headers/FormHeader";
import UnsavedChangesWarning from "../../Forms/UnsavedChangesWarning";
import DiscardModal from "@/components/admin/Modals/DiscardModal";
import { useDiscardWarning } from "@/hooks/useDiscardWarning";

// Definisanje šeme za validaciju
export const brandTypeSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  description: z.string().optional(),
});

export type BrandTypeFormValues = z.infer<typeof brandTypeSchema>;

interface BrandTypeFormProps {
  initialData?: BrandType;
  isEdit?: boolean;
}

export function BrandTypeForm({ initialData, isEdit = false }: BrandTypeFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Inicijalizacija forme
  const form = useForm<BrandTypeFormValues>({
    resolver: zodResolver(brandTypeSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
    },
  });

  // Check if form has unsaved changes
  const hasUnsavedChanges = form.formState.isDirty;

  // Setup discard warning hook
  const {
    showDiscardModal,
    handleConfirmDiscard,
    handleCancelDiscard,
    navigateTo,
  } = useDiscardWarning({
    hasUnsavedChanges,
    onDiscard: () => {
      router.push("/brands/types");
    },
  });

  // Handler za submit forme
  const onSubmit = async (values: BrandTypeFormValues) => {
    setIsSubmitting(true);

    try {
      // Priprema podataka - ukloniti prazna polja
      const payload: Record<string, any> = { name: values.name };
      
      // Dodajemo description samo ako nije prazan
      if (values.description && values.description.trim() !== '') {
        payload.description = values.description;
      }
      
      console.log("Sending payload:", payload);

      let url = `${API_BASE_URL}/api/${API_VERSION}/brand-types`;
      let method = "POST";

      // Ako je edit mode, koristimo PUT metodu i dodajemo ID u URL
      if (isEdit && initialData?.id) {
        url = `${url}/${initialData.id}`;
        method = "PUT";
      }

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Failed to ${isEdit ? 'update' : 'create'} brand type`);
      }

      toast.success(`Brand type ${isEdit ? 'updated' : 'created'} successfully!`);
      router.push("/brands/types");
      
    } catch (err: any) {
      toast.error(err.message || `An error occurred while ${isEdit ? 'updating' : 'creating'} the brand type`);
      console.error(`Error ${isEdit ? 'updating' : 'creating'} brand type:`, err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDiscard = () => {
    if (hasUnsavedChanges) {
      handleConfirmDiscard();
    } else {
      router.push("/brands/types");
    }
  };

  return (
    <>
      <FormHeader
        title={isEdit ? initialData?.name || "Edit Brand Type" : "Add new brand type"}
        onSave={form.handleSubmit(onSubmit)}
        onDiscard={handleDiscard}
        saveButtonText={isEdit ? "Save changes" : "Add Brand Type"}
        saveButtonDisabled={!form.formState.isValid || isSubmitting}
        isSubmitting={isSubmitting}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Information */}
        <div>
          <h2 className="text-xl font-semibold mb-4">General Information</h2>
          <Form {...form}>
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="Enter brand type name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter description for the brand type"
                        {...field}
                        rows={4}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
            </div>
          </Form>
        </div>

      </div>

      {/* Discard Modal */}
      <DiscardModal
        isOpen={showDiscardModal}
        onClose={handleCancelDiscard}
        onConfirm={handleConfirmDiscard}
      />
      
      {/* Warning for unsaved changes */}
      <UnsavedChangesWarning hasUnsavedChanges={hasUnsavedChanges} />
    </>
  );
}
