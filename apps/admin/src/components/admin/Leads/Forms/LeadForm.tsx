"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FormHeader from "@/components/admin/Headers/FormHeader";
import UnsavedChangesWarning from "../../Forms/UnsavedChangesWarning";
import DiscardModal from "@/components/admin/Modals/DiscardModal";
import { useDiscardWarning } from "@/hooks/useDiscardWarning";
import { 
  leadSchema, 
  LeadFormValues, 
  LeadFormData,
  initialLeadValues,
  ContactMethod,
  ContactMethodEnum,
  LeadStatus 
} from "@/app/schemas/lead";
import { Trash2 } from "lucide-react";
import { API_BASE_URL, API_VERSION } from "@/app/constants/api";

// Define contact method options with labels - samo EMAIL, PHONE, WHATSAPP
const CONTACT_METHOD_OPTIONS: Array<{ value: string; label: string }> = [
  { value: "EMAIL", label: "Email" },
  { value: "PHONE", label: "Phone" },
  { value: "WHATSAPP", label: "WhatsApp" },
];

// Define status options
const STATUS_OPTIONS = [
  { value: "NEW", label: "New" },
  { value: "CONTACTED", label: "Contacted" },
  { value: "QUALIFIED", label: "Qualified" },
  { value: "WON", label: "Won" },
  { value: "LOST", label: "Lost" },
  { value: "INACTIVE", label: "Inactive" },
];

const getStatusBadgeStyle = (status: string) => {
  switch(status) {
    case "NEW":
      return "bg-yellow-900/20 hover:bg-yellow-900/40 text-yellow-300 border-yellow-900/50";
    case "CONTACTED":
      return "bg-blue-900/20 hover:bg-blue-900/40 text-blue-300 border-blue-900/50";
    case "QUALIFIED":
      return "bg-purple-900/20 hover:bg-purple-900/40 text-purple-300 border-purple-900/50";
    case "WON":
      return "bg-green-900/20 hover:bg-green-900/40 text-green-300 border-green-900/50";
    case "LOST":
      return "bg-red-900/20 hover:bg-red-900/40 text-red-300 border-red-900/50";
    case "INACTIVE":
      return "bg-gray-900/20 hover:bg-gray-900/40 text-gray-300 border-gray-900/50";
    default:
      return "";
  }
};

interface LeadFormProps {
  initialData?: Partial<LeadFormData>;
  isEditing?: boolean;
}

const LeadForm: React.FC<LeadFormProps> = ({
  initialData = initialLeadValues,
  isEditing = false,
}) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  // Type assertion za initialData
  const typedInitialData = initialData as LeadFormData;
  
  const form = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      firstName: typedInitialData.firstName || "",
      lastName: typedInitialData.lastName || "",
      email: typedInitialData.email || "",
      phone: typedInitialData.phone || "",
      preferredContactMethod: typedInitialData.preferredContactMethod || [],
      status: typedInitialData.status || "NEW"
    },
    mode: "onChange"
  });

  // Watch required form fields
  const firstName = form.watch("firstName");
  const lastName = form.watch("lastName");
  const email = form.watch("email");
  const preferredContactMethod = form.watch("preferredContactMethod");

  // Check if form has unsaved changes
  const hasUnsavedChanges = form.formState.isDirty;

  // Check if form is valid for saving
  const isSaveEnabled = useCallback(() => {
    const formValues = form.getValues();
    const hasRequiredFields = 
      !!formValues.firstName && 
      formValues.firstName.trim().length >= 2 && 
      !!formValues.lastName && 
      formValues.lastName.trim().length >= 2 &&
      !!formValues.email &&
      formValues.preferredContactMethod &&
      formValues.preferredContactMethod.length > 0;

    const hasChanges = form.formState.isDirty;
    const hasErrors = Object.keys(form.formState.errors).length > 0;

    return hasRequiredFields && hasChanges && !hasErrors && !isSubmitting;
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

  const onSubmit = async (data: LeadFormValues) => {
    try {
      setIsSubmitting(true);

      const leadId = typedInitialData.id;
      
      if (!leadId && isEditing) {
        throw new Error('Lead ID is missing for edit operation');
      }

      const apiUrl = isEditing 
        ? `${API_BASE_URL}/api/${API_VERSION}/leads/${leadId}`
        : `${API_BASE_URL}/api/${API_VERSION}/leads`;

      // Double check that all required fields are present
      if (!data.firstName || !data.lastName || !data.email || !data.preferredContactMethod || data.preferredContactMethod.length === 0) {
        if (!data.firstName) {
          form.setError("firstName", { type: "required", message: "First name is required" });
        }
        if (!data.lastName) {
          form.setError("lastName", { type: "required", message: "Last name is required" });
        }
        if (!data.email) {
          form.setError("email", { type: "required", message: "Email is required" });
        }
        if (!data.preferredContactMethod || data.preferredContactMethod.length === 0) {
          form.setError("preferredContactMethod", { type: "required", message: "At least one contact method is required" });
        }
        
        toast.error("Please fill in all required fields");
        setIsSubmitting(false);
        return;
      }
      
      // Prepare data for API - uklanjamo status iz payload-a
      const payload = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone || undefined,
        preferredContactMethod: data.preferredContactMethod,
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
        throw new Error(responseData?.message || `Error ${isEditing ? 'updating' : 'creating'} lead (Status: ${response.status})`);
      }
      
      toast.success(isEditing ? "Lead updated successfully!" : "Lead created successfully!");
      
      // Ako je edit, idemo na single stranicu, ako je kreiranje idemo na listu
      if (isEditing && leadId) {
        router.push(`/leads/${leadId}`);
      } else {
        router.push("/leads");
      }
    } catch (error) {
      console.error('Submit error:', error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to save lead');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDiscard = () => {
    if (hasUnsavedChanges) {
      // Ako je edit, idemo na single stranicu, ako je kreiranje idemo na listu
      if (isEditing && typedInitialData.id) {
        navigateTo(`/leads/${typedInitialData.id}`);
      } else {
        navigateTo("/leads");
      }
    } else {
      if (isEditing && typedInitialData.id) {
        router.push(`/leads/${typedInitialData.id}`);
      } else {
        router.push("/leads");
      }
    }
  };

  const handleDelete = async () => {
    const leadId = typedInitialData.id;
    if (!leadId) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/${API_VERSION}/leads/${leadId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Failed to delete lead: ${response.status}`);
      }

      toast.success('Lead deleted successfully');
      router.push('/leads');
      router.refresh();
    } catch (error) {
      toast.error('Failed to delete lead');
    }
  };

  const handleStatusChange = async (newStatus: LeadStatus) => {
    const leadId = typedInitialData.id;
    if (!leadId) {
      form.setValue("status", newStatus, { shouldDirty: true });
      return;
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/${API_VERSION}/leads/${leadId}/status`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        throw new Error(`Failed to update status: ${response.status}`);
      }

      form.setValue("status", newStatus, { shouldDirty: true });
      toast.success(`Lead status updated to ${newStatus}`);
      router.refresh();
    } catch (error) {
      toast.error('Failed to update lead status');
      form.setValue("status", newStatus, { shouldDirty: true });
    }
  };

  const renderStatusBadge = () => {
    if (!isEditing) return null;

    return (
      <FormField
        control={form.control}
        name="status"
        render={({ field }) => {
          const status = field.value || "NEW";
          return (
            <Select 
              onValueChange={(value: LeadStatus) => handleStatusChange(value)}
              value={status}
              disabled={false}
            >
              <SelectTrigger className="w-auto border-0 p-0 h-auto hover:bg-transparent focus:ring-0">
                <Badge 
                  className={`${getStatusBadgeStyle(status)} px-4 py-1.5 text-sm font-medium transition-all duration-200 cursor-pointer hover:opacity-80`}
                >
                  {status}
                </Badge>
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((status) => (
                  <SelectItem 
                    key={status.value} 
                    value={status.value}
                    className="text-sm"
                  >
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          );
        }}
      />
    );
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
              <AlertDialogTitle>Are you sure you want to delete this lead?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the lead
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
    <>
      <FormHeader
        title={isEditing 
          ? `${typedInitialData?.firstName || ''} ${typedInitialData?.lastName || ''}`.trim() || "Edit lead" 
          : "Add new lead"
        }
        titleContent={renderStatusBadge()}
        extraButtons={renderDeleteButton()}
        onSave={handleSave}
        onDiscard={handleDiscard}
        saveButtonText={isEditing ? "Save changes" : "Add Lead"}
        saveButtonDisabled={!isSaveEnabled()}
        isSubmitting={isSubmitting}
      />
      
      <div className="max-w-2xl">
        {/* Personal Information */}
        <div>
            <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
            <Form {...form}>
              <div className="space-y-6">
                {/* First Name & Last Name Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name <span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                          <Input placeholder="Enter first name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name <span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                          <Input placeholder="Enter last name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder="Enter email address" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Phone */}
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input 
                          type="tel" 
                          placeholder="Enter phone number" 
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Preferred Contact Methods */}
                <FormField
                  control={form.control}
                  name="preferredContactMethod"
                  render={() => (
                    <FormItem>
                      <FormLabel>Preferred Contact Methods <span className="text-destructive">*</span></FormLabel>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {CONTACT_METHOD_OPTIONS.map((option) => (
                          <FormField
                            key={option.value}
                            control={form.control}
                            name="preferredContactMethod"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={option.value}
                                  className="flex flex-row items-start space-x-1"
                                >
                                  <FormControl>
                                    <Checkbox
                                      className="mt-0.5"
                                      checked={field.value?.includes(option.value)}
                                      onCheckedChange={(checked) => {
                                        const currentValues = field.value || [];
                                        return checked
                                          ? field.onChange([...currentValues, option.value])
                                          : field.onChange(
                                              currentValues.filter(
                                                (value) => value !== option.value
                                              )
                                            )
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="text-sm font-normal">
                                    {option.label}
                                  </FormLabel>
                                </FormItem>
                              )
                            }}
                          />
                        ))}
                      </div>
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

export default LeadForm;