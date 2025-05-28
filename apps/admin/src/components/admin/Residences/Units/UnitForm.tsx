"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";

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
  FormDescription,
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
  unitSchema,
  UnitFormValues,
  initialUnitValues,
  UnitStatus,
  UnitStatusType,
  TransactionType,
  ServiceAmountType,
  serviceTypeSchema
} from "@/app/schemas/unit";
import { Check, Trash2, X, Plus, Minus } from "lucide-react";
import { API_BASE_URL, API_VERSION } from "@/app/constants/api";
import MultipleImageUpload, { UploadedImage } from "../../Forms/MultipleImageUpload";

interface UnitType {
  id: string;
  name: string;
  description?: string;
}

interface EditModeImage {
  preview: string;
  isFeatured: boolean;
  order: number;
  mediaId: string;
}

interface ServiceType {
  name: string;
  amount: "DAILY" | "WEEKLY" | "MONTHLY";
}

const getStatusBadgeStyle = (status: string) => {
  switch (status) {
    case "ACTIVE":
      return "bg-green-900/20 hover:bg-green-900/40 text-green-300 border-green-900/50";
    case "INACTIVE":
      return "bg-gray-900/20 hover:bg-gray-900/40 text-gray-300 border-gray-900/50";
    case "SOLD":
      return "bg-red-900/20 hover:bg-red-900/40 text-red-300 border-red-900/50";
    case "RESERVED":
      return "bg-yellow-900/20 hover:bg-yellow-900/40 text-yellow-300 border-yellow-900/50";
    case "DRAFT":
      return "bg-blue-900/20 hover:bg-blue-900/40 text-blue-300 border-blue-900/50";
    default:
      return "";
  }
};

interface UnitFormProps {
  initialData?: Partial<UnitFormValues> & { id?: string };
  isEditing?: boolean;
}

const UnitForm: React.FC<UnitFormProps> = ({
  initialData = initialUnitValues,
  isEditing = false,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const residenceIdFromUrl = searchParams.get("residenceId");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [unitTypes, setUnitTypes] = useState<UnitType[]>([]);
  const [loadingUnitTypes, setLoadingUnitTypes] = useState(true);
  const [images, setImages] = useState<(EditModeImage | UploadedImage)[]>([]);
  const [featuredImage, setFeaturedImage] = useState<EditModeImage | UploadedImage | null>(null);
  const [characteristics, setCharacteristics] = useState<string[]>([]);
  const [newCharacteristic, setNewCharacteristic] = useState("");

  const form = useForm<UnitFormValues>({
    resolver: zodResolver(unitSchema),
    defaultValues: {
      name: initialData.name || "",
      description: initialData.description || "",
      surface: initialData.surface || undefined,
      status: initialData.status || "ACTIVE",
      regularPrice: initialData.regularPrice || 0,
      exclusivePrice: initialData.exclusivePrice || undefined,
      exclusiveOfferStartDate: initialData.exclusiveOfferStartDate || "",
      exclusiveOfferEndDate: initialData.exclusiveOfferEndDate || "",
      roomType: initialData.roomType || "",
      roomAmount: initialData.roomAmount || undefined,
      unitTypeId: initialData.unitTypeId || "",
      serviceType: initialData.serviceType || [],
      about: initialData.about || "",
      bathrooms: initialData.bathrooms || "",
      bedroom: initialData.bedroom || "",
      floor: initialData.floor || "",
      transactionType: initialData.transactionType || "SALE",
      characteristics: initialData.characteristics || [],
      residenceId: initialData.residenceId || residenceIdFromUrl || "",
      galleryMediaIds: initialData.galleryMediaIds || [],
      featureImageId: initialData.featureImageId || "",
    },
    mode: "onChange"
  });

  // Fetch unit types from API
  useEffect(() => {
    const fetchUnitTypes = async () => {
      try {
        setLoadingUnitTypes(true);
        const response = await fetch(`${API_BASE_URL}/api/${API_VERSION}/unit-types`, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch unit types: ${response.status}`);
        }

        const data = await response.json();
        if (data.data && Array.isArray(data.data)) {
          setUnitTypes(data.data);
        }
      } catch (error) {
        toast.error('Failed to load unit types');
      } finally {
        setLoadingUnitTypes(false);
      }
    };

    fetchUnitTypes();
  }, []);

  useEffect(() => {
    if (isEditing && initialData.galleryMediaIds && initialData.galleryMediaIds.length > 0) {
      const galleryImages: EditModeImage[] = initialData.galleryMediaIds.map((mediaId: string, index: number) => ({
        mediaId: mediaId,
        preview: `${API_BASE_URL}/api/${API_VERSION}/media/${mediaId}/content`,
        isFeatured: initialData.featureImageId === mediaId,
        order: index
      }));

      if (!initialData.featureImageId && galleryImages.length > 0) {
        galleryImages[0].isFeatured = true;
      }

      setImages(galleryImages);
      const featuredImg = galleryImages.find(img => img.isFeatured);
      if (featuredImg) {
        setFeaturedImage(featuredImg);
      }
    }
  }, [isEditing, initialData.galleryMediaIds, initialData.featureImageId]);

  useEffect(() => {
    if (initialData.characteristics) {
      setCharacteristics(initialData.characteristics);
    }
  }, [initialData.characteristics]);

  const hasUnsavedChanges = form.formState.isDirty;

  const isSaveEnabled = useCallback(() => {
    const formValues = form.getValues();
    const hasRequiredFields =
      !!formValues.name &&
      formValues.name.trim().length >= 2 &&
      !!formValues.unitTypeId &&
      !!formValues.residenceId &&
      formValues.regularPrice > 0;

    if (isEditing) {
      const hasChanges = form.formState.isDirty;
      return hasRequiredFields && hasChanges && !isSubmitting;
    } else {
      return hasRequiredFields && !isSubmitting;
    }
  }, [form, isSubmitting, isEditing]);

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

  // Add characteristic
  const addCharacteristic = () => {
    if (newCharacteristic.trim() && !characteristics.includes(newCharacteristic.trim())) {
      const updated = [...characteristics, newCharacteristic.trim()];
      setCharacteristics(updated);
      form.setValue("characteristics", updated, { shouldDirty: true });
      setNewCharacteristic("");
    }
  };

  // Remove characteristic
  const removeCharacteristic = (index: number) => {
    const updated = characteristics.filter((_, i) => i !== index);
    setCharacteristics(updated);
    form.setValue("characteristics", updated, { shouldDirty: true });
  };

  // Add service type
  const addServiceType = () => {
    const currentServices = form.getValues("serviceType") || [];
    const newService = { name: "", amount: "MONTHLY" as const };
    form.setValue("serviceType", [...currentServices, newService], { shouldDirty: true });
  };

  // Remove service type
  const removeServiceType = (index: number) => {
    const currentServices = form.getValues("serviceType") || []; 
    const updated = currentServices.filter((_, i) => i !== index);
    form.setValue("serviceType", updated, { shouldDirty: true }); 
  };

  const onSubmit = async (data: UnitFormValues) => {
    try {
      setIsSubmitting(true);
      const values = form.getValues();

      console.log("🚀 Starting form submission...");
      console.log("Form values:", values);

      // Upload samo novih slika (one koje imaju file property)
      const newImages = images.filter((img): img is UploadedImage => 'file' in img);
      console.log("📸 New images to upload:", newImages.length);
      console.log("New images details:", newImages.map(img => ({
        name: img.file.name,
        size: img.file.size,
        type: img.file.type,
        isFeatured: img.isFeatured
      })));

      const uploadedImages = await Promise.all(
        newImages.map(async (image, index) => {
          console.log(`📤 Uploading image ${index + 1}/${newImages.length}: ${image.file.name}`);

          const formData = new FormData();
          formData.append('file', image.file);

          console.log("FormData contents:", {
            fileName: image.file.name,
            fileSize: image.file.size,
            fileType: image.file.type
          });

          const uploadUrl = `${API_BASE_URL}/api/${API_VERSION}/media?type=RESIDENCE`;
          console.log("🌐 Upload URL:", uploadUrl);

          try {
            console.log("🔄 Sending fetch request...");
            const response = await fetch(uploadUrl, {
              method: 'POST',
              credentials: 'include',
              body: formData,
            });

            console.log("📋 Response status:", response.status);
            console.log("📋 Response headers:", Object.fromEntries(response.headers.entries()));

            if (!response.ok) {
              const errorText = await response.text();
              console.error("❌ Upload failed - Response text:", errorText);
              throw new Error(`Failed to upload image ${image.file.name} (Status: ${response.status})`);
            }

            const responseData = await response.json();
            console.log("✅ Upload successful for", image.file.name, "Response:", responseData);

            return {
              mediaId: responseData.data.id,
              isFeatured: image.isFeatured,
              order: image.order
            };
          } catch (fetchError) {
            console.error("❌ Fetch error for", image.file.name, ":", fetchError);
            throw fetchError;
          }
        })
      );

      console.log("✅ All images uploaded successfully:", uploadedImages);

      // Kombinuj postojeće i nove slike
      const existingImages = images
        .filter((img): img is EditModeImage => 'mediaId' in img)
        .map(img => ({
          mediaId: img.mediaId,
          isFeatured: img.isFeatured,
          order: img.order
        }));

      console.log("📁 Existing images:", existingImages);

      const allImages = [...existingImages, ...uploadedImages];
      console.log("🖼️ All images combined:", allImages);

      // galleryMediaIds i featureImageId
      const galleryMediaIds = allImages.map(img => img.mediaId);
      const featureImageId = allImages.find(img => img.isFeatured)?.mediaId || null;

      console.log("🎯 Gallery media IDs:", galleryMediaIds);
      console.log("⭐ Featured image ID:", featureImageId);

      // Pripremi payload
      const { id, ...restValues } = values;
      const payload = {
        ...restValues,
        galleryMediaIds,
        featureImageId
      };

      console.log("📦 Final payload:", JSON.stringify(payload, null, 2));

      const apiUrl = isEditing
        ? `${API_BASE_URL}/api/${API_VERSION}/units/${id}`
        : `${API_BASE_URL}/api/${API_VERSION}/units`;

      console.log("🌐 API URL for unit save:", apiUrl);
      console.log("🔧 Method:", isEditing ? 'PUT' : 'POST');

      const response = await fetch(apiUrl, {
        method: isEditing ? 'PUT' : 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      console.log("📋 Unit save response status:", response.status);

      if (!response.ok) {
        const responseText = await response.text();
        console.error("❌ Unit save failed:", responseText);
        let responseData;
        try {
          responseData = JSON.parse(responseText);
        } catch (e) {
          responseData = { message: responseText };
        }
        throw new Error(responseData?.message || `Error ${isEditing ? 'updating' : 'creating'} unit (Status: ${response.status})`);
      }

      const unitResponse = await response.json();
      console.log("✅ Unit saved successfully:", unitResponse);

      toast.success(isEditing ? "Unit updated successfully!" : "Unit created successfully!");
      if (values.residenceId) {
        router.push(`/residences/${values.residenceId}?tab=inventory`);
      } else {
        router.push("/units");
      }
    } catch (error) {
      console.error("💥 Complete error in onSubmit:", error);
      console.error("💥 Error stack:", error instanceof Error ? error.stack : 'No stack trace');

      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to save unit');
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleDiscard = () => {
    if (hasUnsavedChanges) {
      const residenceId = form.getValues("residenceId");
      if (residenceId) {
        navigateTo(`/residences/${residenceId}?tab=inventory`);
      } else {
        navigateTo("/units");
      }
    } else {
      const residenceId = form.getValues("residenceId");
      if (residenceId) {
        router.push(`/residences/${residenceId}?tab=inventory`);
      } else {
        router.push("/units");
      }
    }
  };

  const handleDelete = async () => {
    if (!initialData?.id) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/${API_VERSION}/units/${initialData.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Failed to delete unit: ${response.status}`);
      }

      toast.success('Unit deleted successfully');
      const residenceId = form.getValues("residenceId");
      if (residenceId) {
        router.push(`/residences/${residenceId}?tab=inventory`);
      } else {
        router.push('/units');
      }
      router.refresh();
    } catch (error) {
      toast.error('Failed to delete unit');
    }
  };

  const handleStatusChange = async (newStatus: UnitStatusType) => {
    if (!initialData?.id) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/${API_VERSION}/units/${initialData.id}/status`, {
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
      toast.success(`Unit status updated to ${newStatus}`);
      router.refresh();
    } catch (error) {
      toast.error('Failed to update unit status');
    }
  };

  const renderStatusBadge = () => {
    if (!isEditing) return null;

    const allowedStatuses = Object.values(UnitStatus) as string[];

    return (
      <FormField
        control={form.control}
        name="status"
        render={({ field }) => (
          <Select
            onValueChange={(value) => handleStatusChange(value as UnitStatusType)}
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
              <AlertDialogTitle>Are you sure you want to delete this unit?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the unit
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
    if (!isSaveEnabled()) {
      toast.error("Please fill in all required fields correctly");
      return;
    }

    onSubmit(form.getValues());
  }, [form, onSubmit, isSaveEnabled]);

  return (
    <>
      <FormHeader
        title={isEditing ? initialData.name || "Edit unit" : "Add new unit"}
        titleContent={renderStatusBadge()}
        extraButtons={renderDeleteButton()}
        onSave={handleSave}
        onDiscard={handleDiscard}
        saveButtonText={isEditing ? "Save changes" : "Add Unit"}
        saveButtonDisabled={!isSaveEnabled()}
        isSubmitting={isSubmitting}
      />

      <div className="w-full mx-auto py-6">
        <Form {...form}>
          <form className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unit Name <span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                          <Input placeholder="Enter unit name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter unit description"
                            className="min-h-[100px]"
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="unitTypeId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unit Type <span className="text-destructive">*</span></FormLabel>
                        <Select
                          disabled={loadingUnitTypes}
                          onValueChange={field.onChange}
                          value={field.value}
                          defaultValue={field.value}
                        >
                          <FormControl className="w-full">
                            <SelectTrigger>
                              <SelectValue placeholder="Select unit type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {unitTypes.map((type) => (
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

                  <FormField
                    control={form.control}
                    name="transactionType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Transaction Type <span className="text-destructive">*</span></FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl className="w-full">
                            <SelectTrigger>
                              <SelectValue placeholder="Select transaction type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.entries(TransactionType).map(([key, value]) => (
                              <SelectItem key={value} value={value}>
                                {key}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Property Details */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Property Details</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="bedroom"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bedrooms</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. 2" {...field} value={field.value || ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="bathrooms"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bathrooms</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. 2" {...field} value={field.value || ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="surface"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Surface (m²)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.1"
                              placeholder="80.5"
                              {...field}
                              onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="floor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Floor</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. 5" {...field} value={field.value || ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="roomType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Room Type</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Deluxe" {...field} value={field.value || ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="roomAmount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Room Amount</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="2"
                              {...field}
                              onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing Information */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Pricing Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="regularPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Regular Price <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="120000"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : 0)}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="exclusivePrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Exclusive Price</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="110000"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="exclusiveOfferStartDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Exclusive Offer Start Date</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          value={field.value ? field.value.split('T')[0] : ""}
                          onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value).toISOString() : "")}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="exclusiveOfferEndDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Exclusive Offer End Date</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          value={field.value ? field.value.split('T')[0] : ""}
                          onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value).toISOString() : "")}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Service Types */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Service Types</h2>
              <div className="space-y-4">
                {form.watch("serviceType")?.map((service, index) => ( // Promenjen sa serviceTypes na serviceType
                  <div key={index} className="flex gap-4 items-end">
                    <FormField
                      control={form.control}
                      name={`serviceType.${index}.name`} // Promenjen sa serviceTypes na serviceType
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Service Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Premium" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`serviceType.${index}.amount`} // Promenjen sa serviceTypes na serviceType
                      render={({ field }) => (
                        <FormItem className="w-40">
                          <FormLabel>Amount Type</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Object.entries(ServiceAmountType).map(([key, value]) => (
                                <SelectItem key={value} value={value}>
                                  {key}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeServiceType(index)}
                      className="mb-2"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  onClick={addServiceType}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Service Type
                </Button>
              </div>
            </div>
            {/* Characteristics */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Characteristics</h2>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add characteristic (e.g. Balcony, Sea View)"
                    value={newCharacteristic}
                    onChange={(e) => setNewCharacteristic(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addCharacteristic();
                      }
                    }}
                  />
                  <Button type="button" onClick={addCharacteristic}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {characteristics.map((characteristic, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1 bg-secondary px-2 py-1 rounded-md"
                    >
                      <span className="text-sm">{characteristic}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCharacteristic(index)}
                        className="h-auto p-0 w-4"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* About */}
            <div>
              <h2 className="text-xl font-semibold mb-4">About</h2>
              <FormField
                control={form.control}
                name="about"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>About This Unit</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="This is a beautiful deluxe unit with a modern design and great amenities."
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

            {/* Gallery */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Gallery</h2>
              <div className="space-y-4">
                <MultipleImageUpload
                  onChange={setImages}
                  onFeaturedChange={setFeaturedImage}
                  maxImages={10}
                  maxSizePerImage={5}
                  initialImages={images.filter((img): img is EditModeImage => 'mediaId' in img)}
                />
              </div>
            </div>
          </form>
        </Form>
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

export default UnitForm;