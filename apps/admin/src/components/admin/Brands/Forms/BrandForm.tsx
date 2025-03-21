"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
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
import ImageUpload from "@/components/admin/Forms/ImageUpload";
import UnsavedChangesWarning from "../../Forms/UnsavedChangesWarning";
import DiscardModal from "@/components/admin/Modals/DiscardModal";
import { useDiscardWarning } from "@/hooks/useDiscardWarning";
import { brandSchema, brandTypes, BrandFormValues, initialBrandValues } from "@/app/schemas/brand";
import { Check, Trash2, X } from "lucide-react";

const getStatusBadgeStyle = (status: string) => {
  switch(status) {
    case "Active":
      return "bg-green-900/20 hover:bg-green-900/40 text-green-300 border-green-900/50";
    case "Pending":
      return "bg-yellow-900/20 hover:bg-yellow-900/40 text-yellow-300 border-yellow-900/50";
    case "Deleted":
      return "bg-red-900/20 hover:bg-red-900/40 text-red-300 border-red-900/50";
    case "Draft":
      return "bg-gray-900/20 hover:bg-gray-900/40 text-gray-300 border-gray-900/50";
    default:
      return "";
  }
};

interface BrandFormProps {
  initialData?: Partial<BrandFormValues>;
  isEditing?: boolean;
}

const BrandForm: React.FC<BrandFormProps> = ({
  initialData = initialBrandValues,
  isEditing = false,
}) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logoValid, setLogoValid] = useState(initialData?.logo ? true : false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  
  const form = useForm<BrandFormValues>({
    resolver: zodResolver(brandSchema),
    defaultValues: initialData,
    mode: "onChange", // Validate on change
  });

  // Watch required form fields
  const brandName = form.watch("name");
  const brandType = form.watch("type");
  const brandStatus = form.watch("status");

  // Determine if the form is valid - all required fields must be filled
  const isFormValid = 
    !!brandName && 
    brandName.trim().length >= 2 && 
    !!brandType && 
    !!brandStatus &&
    logoValid;
    
  // Check if form has unsaved changes
  const hasUnsavedChanges = form.formState.isDirty || form.formState.dirtyFields.logo;

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

  // Zakačimo se na promene vrednosti logo-a u formi
  useEffect(() => {
    // Kada se promeni logo u formi, proveravamo da li je validan
    const logoValue = form.getValues("logo");
    setLogoValid(!!logoValue);
  }, [form.watch("logo")]);

  const onSubmit = async (data: BrandFormValues) => {
    try {
      setIsSubmitting(true);
      
      // Double check that all required fields are present
      if (!data.name || !data.type || !data.logo) {
        if (!data.name) {
          form.setError("name", { type: "required", message: "Brand name is required" });
        }
        if (!data.type) {
          form.setError("type", { type: "required", message: "Brand type is required" });
        }
        if (!data.logo) {
          form.setError("logo", { type: "required", message: "Brand logo is required" });
        }
        
        toast.error("Please fill in all required fields");
        return;
      }
      
      // Here you would normally submit the data to your API
      console.log("Form data to submit:", data);
      
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(isEditing ? "Brand updated successfully!" : "Brand created successfully!");
      router.push("/brands");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDiscard = () => {
    if (hasUnsavedChanges) {
      navigateTo("/brands");
    } else {
      router.push("/brands");
    }
  };

  const handleDelete = async () => {
    try {
      setIsSubmitting(true);
      // Ovde bi išla logika za brisanje
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Brand deleted successfully!");
      router.push("/brands");
    } catch (error) {
      console.error("Error deleting brand:", error);
      toast.error("An error occurred while deleting the brand.");
    } finally {
      setIsSubmitting(false);
      setShowDeleteDialog(false);
    }
  };

  const handleReject = () => {
    form.setValue("status", "Deleted");
    toast.success("Brand rejected successfully!");
    setShowRejectDialog(false);
  };

  const renderStatusBadge = () => {
    if (!isEditing) return null;

    const allowedStatuses = ["Active", "Draft"];

    return (
      <FormField
        control={form.control}
        name="status"
        render={({ field }) => (
          <Select 
            onValueChange={(value) => {
              field.onChange(value);
              toast.success(`Brand status updated to ${value}`);
            }} 
            value={field.value}
          >
            <SelectTrigger className="w-auto border-0 p-0 h-auto hover:bg-transparent focus:ring-0">
              <Badge 
                className={`${getStatusBadgeStyle(field.value)} px-4 py-1.5 text-sm font-medium transition-all duration-200 cursor-pointer hover:opacity-80`}
              >
                {field.value}
              </Badge>
            </SelectTrigger>
            <SelectContent>
              {allowedStatuses.map((status) => (
                <SelectItem 
                  key={status} 
                  value={status}
                  className="text-sm"
                >
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
    );
  };

  const renderStatusActions = () => {
    if (!isEditing || form.watch("status") !== "Pending") return null;

    return (
      <>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            className="bg-green-900/20 hover:bg-green-900/40 text-green-300 border-green-900/50 transition-all duration-300"
            onClick={() => {
              form.setValue("status", "Active");
              toast.success("Brand approved successfully!");
            }}
          >
            <Check className="h-4 w-4 mr-2" />
            Approve
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="bg-red-900/20 hover:bg-red-900/40 text-red-300 border-red-900/50 transition-all duration-300"
            onClick={() => setShowRejectDialog(true)}
          >
            <X className="h-4 w-4 mr-2" />
            Reject
          </Button>
        </div>

        <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure you want to reject this brand?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. The brand will be marked as deleted.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleReject} 
                className="bg-destructive text-white hover:bg-destructive/80 transition-colors cursor-pointer"
              >
                Reject
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    );
  };

  const renderDeleteButton = () => {
    if (!isEditing || form.watch("status") === "Deleted") return null;

    return (
      <>
        <Button
          variant="destructive"
          onClick={() => setShowDeleteDialog(true)}
          className="cursor-pointer transition-colors"
        >
          <Trash2 />
          Delete
        </Button>
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure you want to delete this brand?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the brand
                and all associated data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive text-white hover:bg-destructive/80 transition-colors cursor-pointer">
                <Trash2 />
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
        title={isEditing ? initialData.name || "Edit brand" : "Add new brand"}
        titleContent={renderStatusBadge()}
        titleActions={renderStatusActions()}
        extraButtons={renderDeleteButton()}
        onSave={form.handleSubmit(onSubmit)}
        onDiscard={handleDiscard}
        saveButtonText={isEditing ? "Save changes" : "Add Brand"}
        saveButtonDisabled={!isFormValid || isSubmitting}
        isSubmitting={isSubmitting}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Information */}
        <div>
            <h2 className="text-xl font-semibold mb-4">General Information</h2>
            <Form {...form}>
              <div className="space-y-6">
                {/* Brand Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Brand name <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <Input placeholder="Enter full brand name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Brand Description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Brand Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter brand description" 
                          className="min-h-[120px]" 
                          {...field} 
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Brand Type */}
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Brand type <span className="text-destructive">*</span></FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select brand type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {brandTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </Form>
        </div>

        {/* Brand Assets */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Brand Assets</h2>
          <Form {...form}>
            <div className="space-y-6">
              {/* Brand Logo */}
              <FormField
                control={form.control}
                name="logo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand Logo <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <div>
                        <ImageUpload
                          onChange={(file) => {
                            field.onChange(file);
                            setLogoValid(!!file);
                          }}
                          value={field.value}
                          supportedFormats={["JPG", "JPEG", "PNG"]}
                          maxSize={5}
                          required={true}
                          onValidation={setLogoValid}
                        />
                        <p className="text-xs text-muted-foreground mt-2">
                          JPG, JPEG and PNG formats are supported<br />
                          Max. upload size - 5MB
                        </p>
                      </div>
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

export default BrandForm;