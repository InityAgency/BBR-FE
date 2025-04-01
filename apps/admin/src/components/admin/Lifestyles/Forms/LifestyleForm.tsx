"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import FormHeader from "@/components/admin/Headers/FormHeader";
import UnsavedChangesWarning from "../../Forms/UnsavedChangesWarning";
import DiscardModal from "@/components/admin/Modals/DiscardModal";
import { useDiscardWarning } from "@/hooks/useDiscardWarning";
import { lifestyleSchema, LifestyleFormValues, initialLifestyleValues } from "@/app/schemas/lifestyles";
import { API_BASE_URL, API_VERSION } from "@/app/constants/api";

interface LifestyleFormProps {
  initialData?: Partial<LifestyleFormValues> & { 
    id?: string;
  };
  isEditing?: boolean;
}

const LifestyleForm: React.FC<LifestyleFormProps> = ({
  initialData = initialLifestyleValues,
  isEditing = false,
}) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const form = useForm<LifestyleFormValues>({
    resolver: zodResolver(lifestyleSchema),
    defaultValues: initialData,
    mode: "onChange",
  });

  // Watch required form fields
  const lifestyleName = form.watch("name");

  // Check form validity whenever fields change
  useEffect(() => {
    const formValues = form.getValues();
    const valid = !!formValues.name && formValues.name.trim().length >= 2;
    setIsFormValid(valid);
  }, [form, lifestyleName]);

  // Check if form has unsaved changes
  const hasUnsavedChanges = form.formState.isDirty;

  // Check if form is valid for saving
  const isSaveEnabled = useCallback(() => {
    const formValues = form.getValues();
    const hasRequiredFields = !!formValues.name && formValues.name.trim().length >= 2;
    const hasChanges = form.formState.isDirty;

    return hasRequiredFields && hasChanges && !isSubmitting;
  }, [form, isSubmitting]);

  // Setup discard warning hook
  const {
    showDiscardModal,
    handleConfirmDiscard,
    handleCancelDiscard,
    navigateTo,
  } = useDiscardWarning({
    hasUnsavedChanges,
    onDiscard: () => {
      // Additional actions on discard if needed
    },
  });

  const onSubmit = async (data: LifestyleFormValues) => {
    try {
      setIsSubmitting(true);
      
      // Double check that all required fields are present
      if (!data.name) {
        form.setError("name", { type: "required", message: "Lifestyle name is required" });
        toast.error("Please fill in all required fields");
        setIsSubmitting(false);
        return;
      }
      
      // Prepare data for API
      const payload = {
        name: data.name,
      };
      
      // Submit data to API
      const url = isEditing && 'id' in initialData
        ? `${API_BASE_URL}/api/${API_VERSION}/lifestyles/${initialData.id}`
        : `${API_BASE_URL}/api/${API_VERSION}/lifestyles`;
      
      const method = isEditing ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error ${isEditing ? 'updating' : 'creating'} lifestyle`);
      }
      
      toast.success(isEditing ? "Lifestyle updated successfully!" : "Lifestyle created successfully!");
      router.push("/residences/lifestyles");
    } catch (error) {
      console.error('Form submission error:', error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to save lifestyle');
      }
      setIsSubmitting(false);
    }
  };

  const handleDiscard = () => {
    if (hasUnsavedChanges) {
      navigateTo("/residences/lifestyles");
    } else {
      router.push("/residences/lifestyles");
    }
  };

  // Direktan poziv onSubmit umesto prosleđivanja kroz form.handleSubmit
  const handleSave = useCallback(() => {
    const formValues = form.getValues();
    
    if (!isSaveEnabled()) {
      if (!form.formState.isDirty) {
        toast.error("No changes have been made");
      } else {
        toast.error("Please fill in all required fields correctly");
      }
      return;
    }
  
    onSubmit(form.getValues());
  }, [form, onSubmit, isSaveEnabled]);
  const handleDelete = async () => {
    if (!initialData || !('id' in initialData)) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/${API_VERSION}/lifestyles/${initialData.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Failed to delete lifestyle: ${response.status}`);
      }

      toast.success('Lifestyle deleted successfully');
      router.push('/residences/lifestyles');
      router.refresh();
    } catch (error) {
      toast.error('Failed to delete lifestyle');
    }
  };

  const renderDeleteButton = () => {
    if (!isEditing) return null;

    return (
      <>
        <Button
          variant="destructive"
          onClick={() => setShowDeleteDialog(true)}
          className="cursor-pointer transition-colors"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure you want to delete this lifestyle?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the lifestyle
                and all associated data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDelete} 
                className="bg-destructive text-white hover:bg-destructive/80 transition-colors cursor-pointer"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    );
  };

  return (
    <>
      <FormHeader
        title={isEditing ? initialData?.name || "Edit lifestyle" : "Add new lifestyle"}
        onSave={handleSave}
        onDiscard={handleDiscard}
        saveButtonText={isEditing ? "Save changes" : "Add Lifestyle"}
        saveButtonDisabled={!isSaveEnabled()}
        isSubmitting={isSubmitting}
        extraButtons={renderDeleteButton()}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Information */}
        <div>
          <h2 className="text-xl font-semibold mb-4">General Information</h2>
          <Form {...form}>
            <div className="space-y-6">
              {/* Lifestyle Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lifestyle name <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="Enter lifestyle name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
};

export default LifestyleForm;
