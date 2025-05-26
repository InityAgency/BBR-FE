"use client";

import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { 
  rankingCriteriaSchema, 
  RankingCriteriaFormValues, 
  RankingCriteriaData,
  initialRankingCriteriaValues
} from "@/app/schemas/ranking-criteria";
import { API_BASE_URL, API_VERSION } from "@/app/constants/api";

interface RankingCriteriaFormProps {
  initialData?: Partial<RankingCriteriaData>;
  isEditing?: boolean;
  onSubmitSuccess?: () => void;
}

const RankingCriteriaForm: React.FC<RankingCriteriaFormProps> = ({
  initialData = initialRankingCriteriaValues,
  isEditing = false,
  onSubmitSuccess,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<RankingCriteriaFormValues>({
    resolver: zodResolver(rankingCriteriaSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      isDefault: initialData?.isDefault || false,
    },
    mode: "onChange"
  });

  // Check if form is valid for saving
  const isSaveEnabled = useCallback(() => {
    const formValues = form.getValues();
    const hasRequiredFields = 
      !!formValues.name && 
      formValues.name.trim().length >= 2;

    const hasChanges = form.formState.isDirty;
    const hasErrors = Object.keys(form.formState.errors).length > 0;

    return hasRequiredFields && hasChanges && !hasErrors && !isSubmitting;
  }, [form, isSubmitting]);

  const onSubmit = async (data: RankingCriteriaFormValues) => {
    try {
      setIsSubmitting(true);
      // Check if criteria ID exists for edit operation
      const criteriaId = (initialData as RankingCriteriaData)?.id;
      
      if (!criteriaId && isEditing) {
        throw new Error('Ranking criteria ID is missing for edit operation');
      }

      const apiUrl = isEditing 
        ? `${API_BASE_URL}/api/${API_VERSION}/ranking-criteria/${criteriaId}`
        : `${API_BASE_URL}/api/${API_VERSION}/ranking-criteria`;

      // Validate required fields
      if (!data.name || data.name.trim().length < 2) {
        form.setError("name", { type: "required", message: "Name is required" });
        toast.error("Please fill in all required fields");
        setIsSubmitting(false);
        return;
      }
      
      // Prepare data for API
      const payload = {
        name: data.name,
        description: data.description || undefined,
        isDefault: data.isDefault,
      };
      
      console.log('Sending payload:', payload);
      
      // Submit data to API
      const response = await fetch(apiUrl, {
        method: isEditing ? 'PUT' : 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload)
      });
      
      const responseText = await response.text();
      
      let responseData;
      if (responseText) {
        try {
          responseData = JSON.parse(responseText);
        } catch (e) {
          responseData = { message: responseText };
        }
      }
      
      if (!response.ok) {
        throw new Error(responseData?.message || `Error ${isEditing ? 'updating' : 'creating'} ranking criteria (Status: ${response.status})`);
      }
      
      toast.success(isEditing ? "Ranking criteria updated successfully!" : "Ranking criteria created successfully!");
      onSubmitSuccess?.();
    } catch (error) {
      console.error('Submit error:', error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to save ranking criteria');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Direct save handler
  const handleSave = useCallback(() => {
    if (!isSaveEnabled()) {
      if (!form.formState.isDirty) {
        toast.error("No changes have been made");
      } else {
        toast.error("Please fill in all required fields correctly");
      }
      return;
    }

    // Direct call to onSubmit
    onSubmit(form.getValues());
  }, [form, onSubmit, isSaveEnabled]);

  return (
    <div className="space-y-6">
      <Form {...form}>
        <div className="space-y-6">
          {/* Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name <span className="text-destructive">*</span></FormLabel>
                <FormControl>
                  <Input placeholder="Enter criteria name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Enter criteria description" 
                    className="min-h-[100px]" 
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Is Default Switch */}
          <FormField
            control={form.control}
            name="isDefault"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Default Criteria</FormLabel>
                  <div className="text-sm text-muted-foreground">
                    Set this criteria as default for new ranking categories
                  </div>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </Form>
      
      {/* Save Button */}
      <div className="flex justify-end space-x-2">
        <Button
          onClick={handleSave}
          disabled={!isSaveEnabled()}
          className="min-w-[140px]"
        >
          {isSubmitting ? "Saving..." : isEditing ? "Save Changes" : "Create Criteria"}
        </Button>
      </div>
    </div>
  );
};

export default RankingCriteriaForm;