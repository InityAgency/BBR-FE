"use client";

import { useState, useEffect, useCallback } from "react";
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
import { rankingCategorySchema, RankingCategoryFormValues, initialRankingCategoryValues } from "@/app/schemas/ranking-category";
import { Trash2 } from "lucide-react";
import { API_BASE_URL, API_VERSION } from "@/app/constants/api";
import { RankingCategory, RankingCategoryType, RankingCategoryStatus } from "@/app/types/models/RankingCategory";
import RankingCriteriaWeights, { CriteriaWeight } from "./RankingCriteriaWeights";

// Define interface for ranking category type from API
interface RankingCategoryTypeApiResponse {
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

const getStatusBadgeStyle = (status: RankingCategoryStatus) => {
  switch(status) {
    case "ACTIVE":
      return "bg-green-900/20 hover:bg-green-900/40 text-green-300 border-green-900/50";
    case "DRAFT":
      return "bg-gray-900/20 hover:bg-gray-900/40 text-gray-300 border-gray-900/50";
    case "DELETED":
      return "bg-red-900/20 hover:bg-red-900/40 text-red-300 border-red-900/50";
    default:
      return "";
  }
};

interface RankingCategoryFormProps {
  initialData?: Partial<RankingCategoryFormValues> & { 
    id?: string;
    featuredImageId?: string;
    rankingCategoryTypeId?: string;
    featuredImageMimeType?: string;
  };
  isEditing?: boolean;
}

const RankingCategoryForm: React.FC<RankingCategoryFormProps> = ({
  initialData = initialRankingCategoryValues,
  isEditing = false,
}) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageValid, setImageValid] = useState(!!initialData?.featuredImageId);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [rankingCategoryTypeOptions, setRankingCategoryTypeOptions] = useState<RankingCategoryTypeApiResponse[]>([]);
  const [loadingRankingCategoryTypes, setLoadingRankingCategoryTypes] = useState(true);
  const [imageChanged, setImageChanged] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const [criteriaWeights, setCriteriaWeights] = useState<CriteriaWeight[]>([]);
  const [loadingCriteriaWeights, setLoadingCriteriaWeights] = useState(false);
  
  const form = useForm<RankingCategoryFormValues>({
    resolver: zodResolver(rankingCategorySchema),
    defaultValues: {
      ...initialData,
      rankingCategoryTypeId: initialData.rankingCategoryTypeId || "",
      status: initialData.status || (isEditing ? undefined : "ACTIVE"),
      featuredImageId: initialData.featuredImageId || undefined
    },
    mode: "onChange"
  });

  // Fetch ranking category types from API when component mounts
  useEffect(() => {
    const fetchRankingCategoryTypes = async () => {
      try {
        setLoadingRankingCategoryTypes(true);
        const response = await fetch(`${API_BASE_URL}/api/${API_VERSION}/ranking-category-types`, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch ranking category types: ${response.status}`);
        }
        
        const data = await response.json();
        if (data.data && Array.isArray(data.data)) {
          setRankingCategoryTypeOptions(data.data);
        }
      } catch (error) {
        toast.error('Failed to load ranking category types');
      } finally {
        setLoadingRankingCategoryTypes(false);
      }
    };

    fetchRankingCategoryTypes();
  }, []);

  // Fetch and create blob URL for featured image when component mounts
  useEffect(() => {
    const fetchImageBlob = async () => {
      if (!initialData.featuredImageId) return;

      try {
        const response = await fetch(`${API_BASE_URL}/api/${API_VERSION}/media/${initialData.featuredImageId}/content`, {
          credentials: 'include',
          headers: {
            'Accept': '*/*',
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch image: ${response.status}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        const blob = new Blob([arrayBuffer], { type: 'image/jpeg' }); // Default to JPEG
        const url = URL.createObjectURL(blob);
        setImageUrl(url);
      } catch (error) {
        toast.error('Failed to load image');
      }
    };

    fetchImageBlob();

    // Clean up blob URL when component unmounts
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [initialData.featuredImageId]);

  // Watch required form fields
  const name = form.watch("name");
  const rankingCategoryTypeId = form.watch("rankingCategoryTypeId");
  const status = form.watch("status");
  const featuredImageId = form.watch("featuredImageId");

  // Check form validity whenever fields change
  useEffect(() => {
    const formValues = form.getValues();
    const valid = 
      !!formValues.name && 
      formValues.name.trim().length >= 2 && 
      !!formValues.rankingCategoryTypeId && 
      (isEditing || imageValid);
    
    setIsFormValid(valid);
  }, [form, name, rankingCategoryTypeId, imageValid, isEditing]);

  // Check if form has unsaved changes
  const hasUnsavedChanges = form.formState.isDirty || imageChanged;

  // Check if form is valid for saving
  const isSaveEnabled = useCallback(() => {
    const formValues = form.getValues();
    const hasRequiredFields = 
      !!formValues.name && 
      formValues.name.trim().length >= 2 && 
      !!formValues.rankingCategoryTypeId;

    const hasChanges = form.formState.isDirty || imageChanged;
    const isImageValid = isEditing || imageValid;

    return hasRequiredFields && isImageValid && hasChanges && !isSubmitting;
  }, [form, imageChanged, imageValid, isEditing, isSubmitting]);

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

  // Handle file upload for featured image
  const uploadImage = async (file: File): Promise<{ id: string, url: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/${API_VERSION}/media?type=RANKING_CATEGORY`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`Failed to upload image: ${response.status}`);
      }
      
      const data = await response.json() as MediaUploadResponse;
      return { id: data.data.id, url: data.data.url };
    } catch (error) {
      throw new Error('Failed to upload image');
    }
  };

  // Monitor image changes
  useEffect(() => {
    if (featuredImageId !== initialData.featuredImageId && featuredImageId !== undefined) {
      setImageChanged(true);
    }
  }, [featuredImageId, initialData.featuredImageId]);

  useEffect(() => {
    const fetchExistingCriteriaWeights = async () => {
      if (!isEditing || !initialData.id) return;
      
      try {
        setLoadingCriteriaWeights(true);
        const response = await fetch(`${API_BASE_URL}/api/${API_VERSION}/ranking-categories/${initialData.id}/criteria-weights`, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch criteria weights: ${response.status}`);
        }
        
        const data = await response.json();
        if (data.data && Array.isArray(data.data)) {
          setCriteriaWeights(data.data);
        }
      } catch (error) {
        toast.error('Failed to load criteria weights');
      } finally {
        setLoadingCriteriaWeights(false);
      }
    };
  
    fetchExistingCriteriaWeights();
  }, [isEditing, initialData.id]);

  const saveCriteriaWeights = async (rankingCategoryId: string) => {
    try {
      // Proverite da li je ukupna težina kriterijuma tačno 100%
      const totalWeight = criteriaWeights.reduce((sum, item) => sum + item.weight, 0);
      if (totalWeight !== 100) {
        toast.error('Total weight of all criteria must be exactly 100%');
        return false;
      }
      
      // Proverite da li je označeno maksimalno 5 default kriterijuma
      const defaultCount = criteriaWeights.filter(c => c.isDefault).length;
      if (defaultCount > 5) {
        toast.error('You can select a maximum of 5 default criteria');
        return false;
      }
      
      const response = await fetch(`${API_BASE_URL}/api/${API_VERSION}/ranking-categories/${rankingCategoryId}/criteria-weights`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          criteria: criteriaWeights.map(c => ({
            rankingCriteriaId: c.rankingCriteriaId,
            weight: c.weight,
            isDefault: c.isDefault
          }))
        })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to save criteria weights: ${response.status}`);
      }
      
      return true;
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to save criteria weights');
      }
      return false;
    }
  };

  const onSubmit = async (data: RankingCategoryFormValues) => {
    try {
      setIsSubmitting(true);

      const rankingCategoryId = initialData.id;
      
      if (!rankingCategoryId && isEditing) {
        throw new Error('Ranking category ID is missing for edit operation');
      }

      const apiUrl = isEditing 
        ? `${API_BASE_URL}/api/${API_VERSION}/ranking-categories/${rankingCategoryId}`
        : `${API_BASE_URL}/api/${API_VERSION}/ranking-categories`;

      // Double check that all required fields are present
      if (!data.name || !data.rankingCategoryTypeId || (!isEditing && !data.featuredImageId && !initialData.featuredImageId)) {
        if (!data.name) {
          form.setError("name", { type: "required", message: "Name is required" });
        }
        if (!data.rankingCategoryTypeId) {
          form.setError("rankingCategoryTypeId", { type: "required", message: "Ranking category type is required" });
        }
        if (!isEditing && !data.featuredImageId && !initialData.featuredImageId) {
          form.setError("featuredImageId", { type: "required", message: "Featured image is required" });
        }
        
        toast.error("Please fill in all required fields");
        setIsSubmitting(false);
        return;
      }
      
      // Upload image if changed
      let imageId = initialData.featuredImageId;
      
      if (imageChanged && data.featuredImageId) {
        try {
          const uploadResult = await uploadImage(data.featuredImageId as unknown as File);
          imageId = uploadResult.id;
        } catch (error) {
          toast.error("Failed to upload image");
          setIsSubmitting(false);
          return;
        }
      }
      
      // Prepare data for API
      const payload: any = {
        name: data.name,
        description: data.description || undefined,
        rankingCategoryTypeId: data.rankingCategoryTypeId,
        residenceLimitation: data.residenceLimitation,
        rankingPrice: data.rankingPrice,
        status: data.status
      };

      // Add imageId only if it exists or was changed
      if (imageId || imageChanged) {
        payload.featuredImageId = imageId;
      }
      
      // Set status to ACTIVE for new ranking categories
      if (!isEditing) {
        payload.status = "ACTIVE";
      }
      
      // Submit data to API
      try {
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
          throw new Error(responseData?.message || `Error ${isEditing ? 'updating' : 'creating'} ranking category (Status: ${response.status})`);
        }
        
        toast.success(isEditing ? "Ranking category updated successfully!" : "Ranking category created successfully!");
        router.push("/rankings/ranking-categories");
      } catch (fetchError) {
        throw fetchError;
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to save ranking category');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDiscard = () => {
    if (hasUnsavedChanges) {
      navigateTo("/rankings/ranking-categories");
    } else {
      router.push("/rankings/ranking-categories");
    }
  };

  const handleDelete = async () => {
    if (!initialData?.id) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/${API_VERSION}/ranking-categories/${initialData.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Failed to delete ranking category: ${response.status}`);
      }

      toast.success('Ranking category deleted successfully');
      router.push('/rankings/ranking-categories');
      router.refresh();
    } catch (error) {
      toast.error('Failed to delete ranking category');
    }
  };

  const handleStatusChange = async (newStatus: RankingCategoryStatus) => {
    if (!initialData?.id) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/${API_VERSION}/ranking-categories/${initialData.id}/status`, {
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
      toast.success(`Ranking category status updated to ${newStatus}`);
      router.refresh();
    } catch (error) {
      toast.error('Failed to update ranking category status');
    }
  };

  const renderStatusBadge = () => {
    if (!isEditing) return null;

    const allowedStatuses = ["DRAFT", "ACTIVE", "DELETED"];

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

  const renderDeleteButton = () => {
    if (!isEditing || form.watch("status") === "DELETED") return null;

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
              <AlertDialogTitle>Are you sure you want to delete this ranking category?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the ranking category
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

  const handleSave = useCallback(() => {
    const formValues = form.getValues();
    
    if (!isSaveEnabled()) {
      if (!imageValid && !isEditing) {
        toast.error("Please upload a featured image");
      } else if (!form.formState.isDirty && !imageChanged) {
        toast.error("No changes have been made");
      } else {
        toast.error("Please fill in all required fields correctly");
      }
      return;
    }
  
    onSubmit(form.getValues());
  }, [form, onSubmit, isEditing, imageValid, imageChanged, isSaveEnabled]);

  return (
    <>
      <FormHeader
        title={isEditing ? initialData.name || "Edit ranking category" : "Add new ranking category"}
        titleContent={renderStatusBadge()}
        extraButtons={renderDeleteButton()}
        onSave={handleSave}
        onDiscard={handleDiscard}
        saveButtonText={isEditing ? "Save changes" : "Add Ranking Category"}
        saveButtonDisabled={!isSaveEnabled()}
        isSubmitting={isSubmitting}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Information */}
        <div>
            <h2 className="text-xl font-semibold mb-4">General Information</h2>
            <Form {...form}>
              <div className="space-y-6 mb-6">
                {/* Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <Input placeholder="Enter full name" {...field} />
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
                          placeholder="Enter description" 
                          className="min-h-[120px]" 
                          {...field} 
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Ranking Category Type */}
                <FormField
                  control={form.control}
                  name="rankingCategoryTypeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ranking Category Type <span className="text-destructive">*</span></FormLabel>
                      <Select
                        disabled={loadingRankingCategoryTypes}
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <FormControl className="w-full">
                          <SelectTrigger>
                            <SelectValue placeholder="Select ranking category type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {rankingCategoryTypeOptions.map((type) => (
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

                {/* Residence Limitation */}
                <FormField
                  control={form.control}
                  name="residenceLimitation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Residence Limitation <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <Input 
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          placeholder="Enter residence limitation" 
                          {...field} 
                          value={field.value}
                          onChange={(e) => {
                            const value = e.target.value;
                            // Dozvoli samo brojeve
                            if (value === '' || /^\d+$/.test(value)) {
                              field.onChange(value === '' ? 0 : parseInt(value, 10));
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Ranking Price */}
                <FormField
                  control={form.control}
                  name="rankingPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ranking Price <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-1.5 text-muted-foreground">$</span>
                          <Input 
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            placeholder="Enter ranking price" 
                            className="pl-7"
                            {...field} 
                            value={field.value}
                            onChange={(e) => {
                              const value = e.target.value;
                              // Dozvoli samo brojeve
                              if (value === '' || /^\d+$/.test(value)) {
                                field.onChange(value === '' ? 0 : parseInt(value, 10));
                              }
                            }}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </Form>

            <h2 className="text-xl font-semibold mb-4">Featured image</h2>
            <Form {...form}>
                <div className="space-y-6">
                {/* Featured Image */}
                <FormField
                    control={form.control}
                    name="featuredImageId"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Featured Image <span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                        <div>
                            <ImageUpload
                            onChange={(file) => {
                                field.onChange(file);
                                setImageValid(!!file);
                                setImageChanged(true);
                            }}
                            value={
                                typeof field.value === 'string' 
                                ? imageUrl
                                : field.value instanceof File 
                                    ? field.value 
                                    : null
                            }
                            supportedFormats={["JPG", "JPEG", "PNG", "WEBP"]}
                            maxSize={5}
                            required={!isEditing}
                            onValidation={setImageValid}
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


        {/* Other infos */}
        <div>
        <RankingCriteriaWeights
            onChange={setCriteriaWeights}
            initialCriteria={criteriaWeights}
            rankingCategoryId={initialData.id}
          />
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

export default RankingCategoryForm;