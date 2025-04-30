"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import ImageUpload from "@/components/admin/Forms/ImageUpload";
import UnsavedChangesWarning from "../../Forms/UnsavedChangesWarning";
import DiscardModal from "@/components/admin/Modals/DiscardModal";
import { useDiscardWarning } from "@/hooks/useDiscardWarning";
import { amenitySchema, AmenityFormValues, initialAmenityValues } from "@/app/schemas/amenities";
import { API_BASE_URL, API_VERSION } from "@/app/constants/api";

interface AmenityFormProps {
  initialData?: Partial<AmenityFormValues> & { 
    id?: string;
    icon?: {
      id: string;
      originalFileName: string;
      mimeType: string;
      uploadStatus: string;
      size: number;
    } | null;
    featuredImage?: {
      id: string;
      originalFileName: string;
      mimeType: string;
      uploadStatus: string;
      size: number;
    } | null;
  };
  isEditing?: boolean;
}

const AmenityForm: React.FC<AmenityFormProps> = ({
  initialData = initialAmenityValues,
  isEditing = false,
}) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [iconValid, setIconValid] = useState(initialData?.icon ? true : false);
  const [iconChanged, setIconChanged] = useState(false);
  const [iconUrl, setIconUrl] = useState<string | null>(null);
  
  // Analogno za featuredImage
  const [featuredImageValid, setFeaturedImageValid] = useState(initialData?.featuredImage ? true : false);
  const [featuredImageChanged, setFeaturedImageChanged] = useState(false);
  const [featuredImageUrl, setFeaturedImageUrl] = useState<string | null>(null);
  
  const [isFormValid, setIsFormValid] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  // Inicijalizujemo formu
  const form = useForm<AmenityFormValues>({
    resolver: zodResolver(amenitySchema),
    defaultValues: {
      ...initialData
    },
    mode: "onChange",
  });
  
  // Fetch and create blob URL for icon when component mounts
  useEffect(() => {
    const fetchIconBlob = async () => {
      if (!initialData.icon?.id) return;
      
      try {
        const response = await fetch(`${API_BASE_URL}/api/${API_VERSION}/media/${initialData.icon.id}/content`, {
          credentials: 'include',
          headers: {
            'Accept': '*/*',
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch icon: ${response.status}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        const blob = new Blob([arrayBuffer], { type: initialData.icon.mimeType });
        const url = URL.createObjectURL(blob);
        setIconUrl(url);
      } catch (error) {
        console.error('Error fetching icon:', error);
        toast.error('Failed to load icon');
      }
    };

    fetchIconBlob();

    return () => {
      if (iconUrl) {
        URL.revokeObjectURL(iconUrl);
      }
    };
  }, [initialData.icon?.id]);

  // Fetch and create blob URL for featuredImage when component mounts - identično kao za icon
  useEffect(() => {
    const fetchFeaturedImageBlob = async () => {
      if (!initialData.featuredImage?.id) return;
      
      try {
        const response = await fetch(`${API_BASE_URL}/api/${API_VERSION}/media/${initialData.featuredImage.id}/content`, {
          credentials: 'include',
          headers: {
            'Accept': '*/*',
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch featured image: ${response.status}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        const blob = new Blob([arrayBuffer], { type: initialData.featuredImage.mimeType });
        const url = URL.createObjectURL(blob);
        setFeaturedImageUrl(url);
      } catch (error) {
        console.error('Error fetching featured image:', error);
        toast.error('Failed to load featured image');
      }
    };

    fetchFeaturedImageBlob();

    return () => {
      if (featuredImageUrl) {
        URL.revokeObjectURL(featuredImageUrl);
      }
    };

  }, [initialData.featuredImage?.id]);
  
  // Watch required form fields
  const amenityName = form.watch("name");
  const icon = form.watch("icon");
  const featuredImage = form.watch("featuredImage");

  // Check form validity whenever fields change
  useEffect(() => {
    const formValues = form.getValues();
    const valid = 
      !!formValues.name && 
      formValues.name.trim().length >= 2 && 
      (isEditing || iconValid);
    
    setIsFormValid(valid);
  }, [form, amenityName, iconValid, isEditing]);

  // Check if form has unsaved changes
  const hasUnsavedChanges = form.formState.isDirty || iconChanged || featuredImageChanged;

  // Check if form is valid for saving
  const isSaveEnabled = useCallback(() => {
    const formValues = form.getValues();
    const hasRequiredFields = 
      !!formValues.name && 
      formValues.name.trim().length >= 2;

    const hasChanges = form.formState.isDirty || iconChanged || featuredImageChanged;
    const isIconValid = isEditing || iconValid;

    return hasRequiredFields && isIconValid && hasChanges && !isSubmitting;
  }, [form, iconChanged, featuredImageChanged, iconValid, isEditing, isSubmitting]);

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

  // Handle file upload for images
  const uploadImage = async (file: File, type: string): Promise<{ id: string, url: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/${API_VERSION}/media?type=AMENITY`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'X-Upload-Type': 'AMENITY'
        },
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to upload ${type}`);
      }
      
      const data = await response.json();
      return { id: data.data.id, url: data.data.url };
    } catch (error) {
      console.error(`Error uploading ${type}:`, error);
      throw error;
    }
  };

  // Monitor image changes
  useEffect(() => {
    // Ako je vrednost null (slika je uklonjena), postavite da je došlo do promene
    if (icon === null && initialData.icon) {
      setIconChanged(true);
    }
    // Postojeći kod za praćenje drugih promena
    else if (icon !== initialData.icon && icon !== undefined) {
      setIconChanged(true);
    }
  }, [icon, initialData.icon]);

  useEffect(() => {
    // Ako je vrednost null (slika je uklonjena), postavite da je došlo do promene
    if (featuredImage === null && initialData.featuredImage) {
      setFeaturedImageChanged(true);
    }
    // Postojeći kod za praćenje drugih promena
    else if (featuredImage !== initialData.featuredImage && featuredImage !== undefined) {
      setFeaturedImageChanged(true);
    }
  }, [featuredImage, initialData.featuredImage]);

  const onSubmit = async (data: AmenityFormValues) => {
    try {
      setIsSubmitting(true);
      
      // Double check that all required fields are present
      if (!data.name || (!isEditing && !data.icon && !initialData.icon?.id)) {
        if (!data.name) {
          form.setError("name", { type: "required", message: "Amenity name is required" });
        }
        if (!isEditing && !data.icon && !initialData.icon?.id) {
          form.setError("icon", { type: "required", message: "Amenity icon is required" });
        }
        
        toast.error("Please fill in all required fields");
        setIsSubmitting(false);
        return;
      }
      
      // Upload icon if changed
      let iconId = initialData.icon?.id;
      
      if (iconChanged && data.icon instanceof File) {
        try {
          const uploadResult = await uploadImage(data.icon, "icon");
          iconId = uploadResult.id;
        } catch (error) {
          toast.error("Failed to upload icon");
          console.error("Icon upload error:", error);
          setIsSubmitting(false);
          return;
        }
      }
      
      // Upload featuredImage if changed - isti pristup kao za icon
      let featuredImageId = initialData.featuredImage?.id;
      
      if (featuredImageChanged && data.featuredImage instanceof File) {
        try {
          const uploadResult = await uploadImage(data.featuredImage, "featured image");
          featuredImageId = uploadResult.id;
        } catch (error) {
          toast.error("Failed to upload featured image");
          console.error("Featured image upload error:", error);
          setIsSubmitting(false);
          return;
        }
      }
      
      // Prepare data for API
      const payload: any = {
        name: data.name,
        description: data.description || undefined,
      };

      // Za icon - eksplicitno dodati prazan string ako je uklonjen
      if (iconChanged) {
        payload.iconId = data.icon ? (iconId || "") : "";
      } else if (iconId) {
        payload.iconId = iconId;
      }
      
      // Za featuredImage - eksplicitno dodati prazan string ako je uklonjena
      if (featuredImageChanged) {
        payload.featuredImageId = data.featuredImage ? (featuredImageId || "") : "";
      } else if (featuredImageId) {
        payload.featuredImageId = featuredImageId;
      }
      
      // Submit data to API
      const url = isEditing && 'id' in initialData
        ? `${API_BASE_URL}/api/${API_VERSION}/amenities/${initialData.id}`
        : `${API_BASE_URL}/api/${API_VERSION}/amenities`;
      
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
        throw new Error(errorData.message || `Error ${isEditing ? 'updating' : 'creating'} amenity`);
      }
      
      toast.success(isEditing ? "Amenity updated successfully!" : "Amenity created successfully!");
      router.push("/residences/amenities");
    } catch (error) {
      console.error('Form submission error:', error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to save amenity');
      }
      setIsSubmitting(false);
    }
  };

  const handleDiscard = () => {
    if (hasUnsavedChanges) {
      navigateTo("/residences/amenities");
    } else {
      router.push("/residences/amenities");
    }
  };

  // Direktan poziv onSubmit umesto prosleđivanja kroz form.handleSubmit
  const handleSave = useCallback(() => {
    const formValues = form.getValues();
    
    if (!isSaveEnabled()) {
      if (!iconValid && !isEditing) {
        toast.error("Please upload an icon");
      } else if (!form.formState.isDirty && !iconChanged && !featuredImageChanged) {
        toast.error("No changes have been made");
      } else {
        toast.error("Please fill in all required fields correctly");
      }
      return;
    }
  
    onSubmit(form.getValues());
  }, [form, onSubmit, isEditing, iconValid, featuredImageChanged, iconChanged, isSaveEnabled]);

  const handleDelete = async () => {
    if (!initialData?.id) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/${API_VERSION}/amenities/${initialData.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Failed to delete amenity: ${response.status}`);
      }

      toast.success('Amenity deleted successfully');
      router.push('/residences/amenities');
      router.refresh();
    } catch (error) {
      toast.error('Failed to delete amenity');
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
              <AlertDialogTitle>Are you sure you want to delete this amenity?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the amenity
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

  console.log("featured: ", initialData);
  return (
    <>
      <FormHeader
        title={isEditing ? initialData?.name || "Edit amenity" : "Add new amenity"}
        onSave={handleSave}
        onDiscard={handleDiscard}
        saveButtonText={isEditing ? "Save changes" : "Add Amenity"}
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
              {/* Amenity Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amenity name <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="Enter amenity name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Amenity Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amenity Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter amenity description" 
                        className="min-h-[120px]" 
                        {...field} 
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </Form>
        </div>

        {/* Amenity Assets */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Amenity Assets</h2>
          <Form {...form}>
            <div className="space-y-6">
              {/* Amenity Icon */}
              <FormField
                control={form.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amenity Icon <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <div>
                        <ImageUpload
                          onChange={(file) => {
                            field.onChange(file);
                            setIconValid(!!file);
                            setIconChanged(true);
                          }}
                          value={
                            field.value instanceof File 
                              ? field.value 
                              : iconUrl
                                ? iconUrl
                                : null
                          }
                          supportedFormats={["JPG", "JPEG", "PNG", "WEBP", "SVG"]}
                          maxSize={5}
                          required={!isEditing}
                          onValidation={setIconValid}
                        />
                        <p className="text-xs text-muted-foreground mt-2">
                          JPG, JPEG, PNG, WEBP and SVG formats are supported<br />
                          Max. upload size - 5MB
                        </p>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Featured Image - ISTI PRISTUP KAO ZA ICON */}
              <FormField
                control={form.control}
                name="featuredImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Featured Image</FormLabel>
                    <FormControl>
                      <div>
                        <ImageUpload
                          onChange={(file) => {
                            field.onChange(file);
                            setFeaturedImageValid(!!file);
                            setFeaturedImageChanged(true);
                          }}
                          value={
                            field.value instanceof File 
                              ? field.value 
                              : featuredImageUrl
                                ? featuredImageUrl
                                : null
                          }
                          supportedFormats={["JPG", "JPEG", "PNG", "WEBP"]}
                          maxSize={5}
                          required={false}
                          onValidation={setFeaturedImageValid}
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

export default AmenityForm;