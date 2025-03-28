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
import { brandSchema, BrandFormValues, initialBrandValues } from "@/app/schemas/brand";
import { Check, Trash2, X } from "lucide-react";
import { API_BASE_URL, API_VERSION } from "@/app/constants/api";

// Define interface for brand type from API
interface BrandTypeApiResponse {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

// Response from media upload
interface MediaUploadResponse {
  data: {
    id: string;
    url: string;
  };
  statusCode: number;
  message: string;
}

const getStatusBadgeStyle = (status: string) => {
  switch(status) {
    case "ACTIVE":
      return "bg-green-900/20 hover:bg-green-900/40 text-green-300 border-green-900/50";
    case "PENDING":
      return "bg-yellow-900/20 hover:bg-yellow-900/40 text-yellow-300 border-yellow-900/50";
    case "DRAFT":
      return "bg-gray-900/20 hover:bg-gray-900/40 text-gray-300 border-gray-900/50";
    case "DELETED":
      return "bg-red-900/20 hover:bg-red-900/40 text-red-300 border-red-900/50";
    default:
      return "";
  }
};

interface BrandFormProps {
  initialData?: Partial<BrandFormValues> & { 
    id?: string;
    logo?: {
      id: string;
      originalFileName: string;
      mimeType: string;
      uploadStatus: string;
      size: number;
    } | null;
  };
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
  const [brandTypeOptions, setBrandTypeOptions] = useState<BrandTypeApiResponse[]>([]);
  const [loadingBrandTypes, setLoadingBrandTypes] = useState(true);
  const [logoChanged, setLogoChanged] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  
  const form = useForm<BrandFormValues>({
    resolver: zodResolver(brandSchema),
    defaultValues: initialData,
    mode: "onChange", // Validate on change
  });

  // Fetch brand types from API when component mounts
  useEffect(() => {
    const fetchBrandTypes = async () => {
      try {
        setLoadingBrandTypes(true);
        const response = await fetch(`${API_BASE_URL}/api/${API_VERSION}/brand-types`, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch brand types: ${response.status}`);
        }
        
        const data = await response.json();
        if (data.data && Array.isArray(data.data)) {
          setBrandTypeOptions(data.data);
        }
      } catch (error) {
        console.error('Error fetching brand types:', error);
        toast.error('Failed to load brand types');
      } finally {
        setLoadingBrandTypes(false);
      }
    };

    fetchBrandTypes();
  }, []);

  // Fetch and create blob URL for logo when component mounts
  useEffect(() => {
    const fetchLogoBlob = async () => {
      if (!initialData.logo?.id) return;
      
      console.log('Fetching logo with ID:', initialData.logo.id);
      console.log('Logo mime type:', initialData.logo.mimeType);
      
      try {
        const response = await fetch(`${API_BASE_URL}/api/${API_VERSION}/media/${initialData.logo.id}/content`, {
          credentials: 'include',
          headers: {
            'Accept': '*/*',
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch logo: ${response.status}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        console.log('Received array buffer size:', arrayBuffer.byteLength);
        
        const blob = new Blob([arrayBuffer], { type: initialData.logo.mimeType });
        console.log('Created blob:', blob);
        
        const url = URL.createObjectURL(blob);
        console.log('Created URL:', url);
        
        setLogoUrl(url);
      } catch (error) {
        console.error('Error fetching logo:', error);
        toast.error('Failed to load logo');
      }
    };

    fetchLogoBlob();

    // Clean up blob URL when component unmounts
    return () => {
      if (logoUrl) {
        console.log('Cleaning up URL:', logoUrl);
        URL.revokeObjectURL(logoUrl);
      }
    };
  }, [initialData.logo?.id]);

  // Watch required form fields
  const brandName = form.watch("name");
  const brandTypeId = form.watch("brandTypeId");
  const brandStatus = form.watch("status");
  const logo = form.watch("logo");

  // Determine if the form is valid - all required fields must be filled
  const isFormValid = 
    !!brandName && 
    brandName.trim().length >= 2 && 
    !!brandTypeId && 
    !!brandStatus &&
    (isEditing || logoValid); // Logo je obavezan samo pri kreiranju

  // Check if form has unsaved changes
  const hasUnsavedChanges = form.formState.isDirty || logoChanged;

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

  // Handle file upload for logo
  const uploadLogo = async (file: File): Promise<{ id: string, url: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/${API_VERSION}/media?type=BRAND`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`Failed to upload logo: ${response.status}`);
      }
      
      const data = await response.json() as MediaUploadResponse;
      return { id: data.data.id, url: data.data.url };
    } catch (error) {
      console.error('Error uploading logo:', error);
      throw new Error('Failed to upload logo');
    }
  };

  // Monitor logo changes
  useEffect(() => {
    console.log('Logo changed:', logo);
    console.log('Initial logo:', initialData.logo);
    if (logo !== initialData.logo && logo !== undefined) {
      setLogoChanged(true);
    }
  }, [logo, initialData.logo]);

  const onSubmit = async (data: BrandFormValues) => {
    try {
      setIsSubmitting(true);
      
      // Double check that all required fields are present
      if (!data.name || !data.brandTypeId || (!isEditing && !data.logo && !initialData.logo?.id)) {
        if (!data.name) {
          form.setError("name", { type: "required", message: "Brand name is required" });
        }
        if (!data.brandTypeId) {
          form.setError("brandTypeId", { type: "required", message: "Brand type is required" });
        }
        if (!isEditing && !data.logo && !initialData.logo?.id) {
          form.setError("logo", { type: "required", message: "Brand logo is required" });
        }
        
        toast.error("Please fill in all required fields");
        setIsSubmitting(false);
        return;
      }
      
      // Upload logo if changed
      let logoId = initialData.logo?.id;
      
      if (logoChanged && data.logo instanceof File) {
        try {
          const uploadResult = await uploadLogo(data.logo);
          logoId = uploadResult.id;
        } catch (error) {
          toast.error("Failed to upload logo");
          console.error("Logo upload error:", error);
          setIsSubmitting(false);
          return;
        }
      }
      
      // Prepare data for API
      const payload: any = {
        name: data.name,
        description: data.description || undefined,
        brandTypeId: data.brandTypeId,
        status: data.status
      };

      // Add logoId only if it exists or was changed
      if (logoId || logoChanged) {
        payload.logoId = logoId;
      }
      
      // Add registeredAt for new brands or keep existing for edits
      if (isEditing) {
        payload.registeredAt = initialData.registeredAt;
      } else {
        payload.status = "ACTIVE";
        payload.registeredAt = new Date().toISOString().split('T')[0];
      }
      
      console.log("Submitting brand data:", payload);
      
      // Submit data to API
      const url = isEditing 
        ? `${API_BASE_URL}/api/${API_VERSION}/brands/${initialData.id}`
        : `${API_BASE_URL}/api/${API_VERSION}/brands`;
      
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
        throw new Error(errorData.message || `Error ${isEditing ? 'updating' : 'creating'} brand`);
      }
      
      toast.success(isEditing ? "Brand updated successfully!" : "Brand created successfully!");
      router.push("/brands");
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error('Failed to save brand');
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
    if (!initialData?.id) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/${API_VERSION}/brands/${initialData.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Failed to delete brand: ${response.status}`);
      }

      toast.success('Brand deleted successfully');
      router.push('/brands');
      router.refresh();
    } catch (error) {
      console.error('Error deleting brand:', error);
      toast.error('Failed to delete brand');
    }
  };

  const handleReject = () => {
    form.setValue("status", "Deleted", { shouldDirty: true });
    toast.success("Brand rejected successfully!");
    setShowRejectDialog(false);
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!initialData?.id) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/${API_VERSION}/brands/${initialData.id}/status`, {
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
      toast.success(`Brand status updated to ${newStatus}`);
      router.refresh();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update brand status');
    }
  };

  const renderStatusBadge = () => {
    if (!isEditing) return null;

    const allowedStatuses = ["DRAFT", "ACTIVE", "PENDING", "DELETED"];

    return (
      <FormField
        control={form.control}
        name="status"
        render={({ field }) => (
          <Select 
            onValueChange={handleStatusChange}
            value={field.value}
            disabled={false}
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
          <Trash2 className="h-4 w-4 mr-2" />
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
        title={isEditing ? initialData?.name || "Edit brand" : "Add new brand"}
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
                  name="brandTypeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Brand Type</FormLabel>
                      <Select
                        disabled={loadingBrandTypes}
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <FormControl className="w-full">
                          <SelectTrigger>
                            <SelectValue placeholder="Select brand type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {brandTypeOptions.map((type) => (
                            <SelectItem key={type.id} value={type.id}>
                              {type.name}
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
                            console.log('ImageUpload onChange:', file);
                            field.onChange(file);
                            setLogoValid(!!file);
                            setLogoChanged(true);
                          }}
                          value={
                            field.value instanceof File 
                              ? field.value 
                              : logoUrl
                                ? logoUrl
                                : null
                          }
                          supportedFormats={["JPG", "JPEG", "PNG", "WEBP"]}
                          maxSize={5}
                          required={!isEditing}
                          onValidation={setLogoValid}
                        />
                        <p className="text-xs text-muted-foreground mt-2">
                          JPG, JPEG, PNG and WEBP formats are supported<br />
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