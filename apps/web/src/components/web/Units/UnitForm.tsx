"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter, useSearchParams, useParams } from "next/navigation";

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
} from "@/app/schemas/unit";
import { Check, Trash2, X, Plus, Minus } from "lucide-react";
import { API_BASE_URL, API_VERSION } from "@/app/constants/api";
import MultipleImageUpload, { UploadedImage, EditModeImage } from "@/components/web/Forms/MultipleImageUpload";

interface UnitType {
  id: string;
  name: string;
  description?: string;
}

interface Service {
  name: string;
  amount: "DAILY" | "WEEKLY" | "MONTHLY";
}

// Helper funkcija za sigurno konvertovanje u string
function toStringSafe(val: any): string {
  if (val === undefined || val === null) return "";
  return typeof val === "string" ? val : String(val);
}

// Helper funkcija za sigurno konvertovanje u broj
function toNumberSafe(val: any): number | undefined {
  if (val === undefined || val === null || val === "") return undefined;
  const num = Number(val);
  return isNaN(num) ? undefined : num;
}

const getStatusBadgeStyle = (status: string) => {
  switch (status) {
    case "ACTIVE":
      return "bg-green-900/20 hover:bg-green-900/40 text-green-300 border-green-900/50";
    case "INACTIVE":
      return "bg-gray-900/20 hover:bg-gray-900/40 text-gray-300 border-gray-900/50";
    case "SOLD":
      return "bg-purple-900/20 hover:bg-purple-900/40 text-purple-300 border-purple-900/50";
    case "RESERVED":
      return "bg-blue-900/20 hover:bg-blue-900/40 text-blue-300 border-blue-900/50";
    case "DRAFT":
      return "bg-gray-900/20 hover:bg-gray-900/40 text-gray-300 border-gray-900/50";
    case "PENDING":
      return "bg-yellow-900/20 hover:bg-yellow-900/40 text-yellow-300 border-yellow-900/50";
    default:
      return "";
  }
};

interface UnitFormProps {
  initialData?: Partial<UnitFormValues> & { 
    id?: string;
    featureImage?: { id: string; url?: string };
  };
  isEditing?: boolean;
  initialImages?: any[]; // ✅ DODANO: initialImages prop
}

const UnitForm: React.FC<UnitFormProps> = ({
  initialData = initialUnitValues,
  isEditing = false,
  initialImages = [], // ✅ DODANO: initialImages prop
}) => {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params?.slug as string | undefined;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [unitTypes, setUnitTypes] = useState<UnitType[]>([]);
  const [loadingUnitTypes, setLoadingUnitTypes] = useState(true);
  const [images, setImages] = useState<(EditModeImage | UploadedImage)[]>([]);
  const [featuredImage, setFeaturedImage] = useState<EditModeImage | UploadedImage | null>(null);
  const [characteristics, setCharacteristics] = useState<string[]>([]);
  const [newCharacteristic, setNewCharacteristic] = useState("");
  const [debugCounter, setDebugCounter] = useState(0);

  // Force re-render for debug purposes
  useEffect(() => {
    const interval = setInterval(() => {
      setDebugCounter(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const form = useForm<UnitFormValues>({
    resolver: zodResolver(unitSchema),
    defaultValues: isEditing && initialData ? {
      ...initialUnitValues,
      ...initialData,
    } : initialUnitValues,
    mode: "onChange",
  });

  // Nova funkcija za dobijanje residence ID iz slug-a
  const fetchResidenceFromSlug = useCallback(async () => {
    if (!slug) return null;

    try {
      const response = await fetch(`${API_BASE_URL}/api/${API_VERSION}/public/residences/slug/${slug}`, {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch residence by slug");
      const data = await response.json();
      return data.data?.id || null;
    } catch (e) {
      console.error("Error fetching residence from slug:", e);
      return null;
    }
  }, [slug]);

  // Fetch unit types from API
  useEffect(() => {
    const fetchUnitTypes = async () => {
      try {
        setLoadingUnitTypes(true);
        const response = await fetch(`${API_BASE_URL}/api/${API_VERSION}/unit-types`, {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch unit types: ${response.status}`);
        }

        const data = await response.json();
        if (data.data && Array.isArray(data.data)) {
          setUnitTypes(data.data);
        }
      } catch (error) {
        toast.error("Failed to load unit types");
        console.error("Error fetching unit types:", error);
      } finally {
        setLoadingUnitTypes(false);
      }
    };

    fetchUnitTypes();
  }, []);

  // ✅ UKLONJEN STARI COMPLEX FETCH - sada koristimo jednostavne useEffect-e

  // Initialize characteristics from form data
  useEffect(() => {
    const formCharacteristics = form.watch("characteristics");
    if (formCharacteristics && Array.isArray(formCharacteristics)) {
      setCharacteristics(formCharacteristics);
    }
  }, [form.watch("characteristics")]);

  const hasUnsavedChanges = form.formState.isDirty;

  const isSaveEnabled = useCallback(() => {
    const formValues = form.getValues();
    const formState = form.formState;

    // Provera obaveznih polja
    const hasRequiredFields = {
      name: !!formValues.name && formValues.name.trim().length >= 2,
      unitTypeId: !!formValues.unitTypeId,
      residenceId: !!formValues.residenceId,
      regularPrice: formValues.regularPrice > 0,
      transactionType: !!formValues.transactionType,
      status: !!formValues.status
    };

    const allRequiredFieldsPresent = Object.values(hasRequiredFields).every(Boolean);

    // Provera validnosti forme
    const isFormValid = Object.keys(formState.errors).length === 0;

    // Provera da li ima promena u edit modu
    const hasChanges = isEditing ? formState.isDirty : true;

    // Provera da li je forma u procesu slanja
    const isNotSubmitting = !isSubmitting;

    console.log("Form validation state:", {
      hasRequiredFields,
      allRequiredFieldsPresent,
      isFormValid,
      hasChanges,
      isNotSubmitting,
      errors: formState.errors,
      formValues: {
        name: formValues.name,
        unitTypeId: formValues.unitTypeId,
        residenceId: formValues.residenceId,
        regularPrice: formValues.regularPrice,
        transactionType: formValues.transactionType,
        status: formValues.status
      },
      isDirty: formState.isDirty,
      isSubmitting
    });

    return allRequiredFieldsPresent && isFormValid && hasChanges && isNotSubmitting;
  }, [form, isSubmitting, isEditing]);

  // Dodajem useEffect za praćenje promena forme
  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      console.log("Form field changed:", {
        field: name,
        type,
        value,
        isDirty: form.formState.isDirty,
        errors: form.formState.errors,
        isValid: form.formState.isValid
      });
    });
    return () => subscription.unsubscribe();
  }, [form.watch, form.formState.isDirty, form.formState.errors, form.formState.isValid]);

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

  // Add service
  const addService = () => {
    const currentServices = form.getValues("services") || [];
    const newService = { name: "", amount: "MONTHLY" as const };
    form.setValue("services", [...currentServices, newService], { shouldDirty: true });
  };

  // Remove service
  const removeService = (index: number) => {
    const currentServices = form.getValues("services") || [];
    const updated = currentServices.filter((_, i) => i !== index);
    form.setValue("services", updated, { shouldDirty: true });
  };

  const uploadUnitImages = async (images: (EditModeImage | UploadedImage)[]) => {
    const uploadedImages: { mediaId: string; isFeatured: boolean; order: number }[] = [];

    for (const image of images) {
      if ('file' in image && image.file) {
        const formData = new FormData();
        formData.append('file', image.file);
        try {
          const response = await fetch(
            `${API_BASE_URL}/api/${API_VERSION}/media?type=RESIDENCE_UNIT`,
            {
              method: 'POST',
              credentials: 'include',
              body: formData,
            }
          );
          if (response.ok) {
            const data = await response.json();
            uploadedImages.push({
              mediaId: data.data.id,
              isFeatured: image.isFeatured || false,
              order: image.order || uploadedImages.length
            });
          } else {
            toast.error('Failed to upload image');
          }
        } catch (e) {
          toast.error('Failed to upload image');
        }
      } else if ('mediaId' in image && image.mediaId) {
        uploadedImages.push({
          mediaId: image.mediaId,
          isFeatured: image.isFeatured || false,
          order: image.order || uploadedImages.length
        });
      }
    }
    return uploadedImages;
  };

  const onSubmit = async (data: UnitFormValues) => {
    try {
      setIsSubmitting(true);

      // 1. Prvo uploaduj slike i dobij sve mediaId-jeve
      const uploadedImages = await uploadUnitImages(images);

      // 2. Pripremi galleryMediaIds i featureImageId
      const galleryMediaIds = uploadedImages.map(img => img.mediaId);
      
      // 3. Logika za featureImageId - u edit modu čuvamo postojeći ako nema nove featured slike
      let featureImageId = "";
      if (isEditing && initialData?.featureImageId && !uploadedImages.find(img => img.isFeatured)) {
        // Ako je edit mod i ima postojeći featureImageId, a nema nove featured slike
        featureImageId = initialData.featureImageId;
      } else {
        // Inače koristi novu featured sliku ili prvu sliku
        const featuredImage = uploadedImages.find(img => img.isFeatured) || uploadedImages[0];
        featureImageId = featuredImage ? featuredImage.mediaId : "";
      }

      // 4. Validacija datuma - proveri da li su datumi važeći
      let exclusiveOfferStartDate = data.exclusiveOfferStartDate;
      let exclusiveOfferEndDate = data.exclusiveOfferEndDate;

      // Proveri da li su datumi važeći stringovi
      if (exclusiveOfferStartDate && !isValidDateString(exclusiveOfferStartDate)) {
        exclusiveOfferStartDate = undefined;
      }
      if (exclusiveOfferEndDate && !isValidDateString(exclusiveOfferEndDate)) {
        exclusiveOfferEndDate = undefined;
      }

      // 5. Pripremi payload
      const payload: any = {
        ...data,
        galleryMediaIds,
        featureImageId,
        residenceId: data.residenceId,
        unitTypeId: data.unitTypeId,
        bedroom: data.bedroom !== undefined && data.bedroom !== null ? String(data.bedroom) : "",
        bathrooms: data.bathrooms !== undefined && data.bathrooms !== null ? String(data.bathrooms) : "",
        floor: data.floor !== undefined && data.floor !== null ? String(data.floor) : "",
        roomAmount: data.roomAmount ? Number(data.roomAmount) : undefined,
        surface: data.surface ? Number(data.surface) : undefined,
        regularPrice: Number(data.regularPrice),
        exclusivePrice: data.exclusivePrice ? Number(data.exclusivePrice) : undefined,
        exclusiveOfferStartDate: exclusiveOfferStartDate || undefined,
        exclusiveOfferEndDate: exclusiveOfferEndDate || undefined,
      };

      // OBRIŠI polja koja ne želiš da šalješ
      delete payload.id;
      delete payload.gallery;
      delete payload.residence;
      delete payload.unitType;
      delete payload.featureImage;
      delete payload.updatedAt;
      delete payload.createdAt;
      delete payload.slug;

      console.log("Final payload:", payload);

      // Pošalji request
      const apiUrl = isEditing
        ? `${API_BASE_URL}/api/${API_VERSION}/units/${data.id}`
        : `${API_BASE_URL}/api/${API_VERSION}/units`;

      const response = await fetch(apiUrl, {
        method: isEditing ? "PUT" : "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const responseText = await response.text();
        console.error("❌ Unit save failed:", responseText);
        let responseData;
        try {
          responseData = JSON.parse(responseText);
        } catch (e) {
          responseData = { message: responseText };
        }
        throw new Error(
          responseData?.message || `Error ${isEditing ? "updating" : "creating"} unit (Status: ${response.status})`
        );
      }

      const unitResponse = await response.json();
      console.log("✅ Unit saved successfully:", unitResponse);

      toast.success(isEditing ? "Unit updated successfully!" : "Unit created successfully!");
      if (slug) {
        router.push(`/developer/residences/${slug}?tab=inventory`);
      } else {
        router.push("/units");
      }
    } catch (error) {
      console.error("💥 Complete error in onSubmit:", error);

      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to save unit");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper funkcija za validaciju datuma
  const isValidDateString = (dateString: string): boolean => {
    if (!dateString || dateString.trim() === "") return false;
    
    // Proveri da li je ISO string format
    if (dateString.includes('T')) {
      const date = new Date(dateString);
      return !isNaN(date.getTime());
    }
    
    // Proveri da li je date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (dateRegex.test(dateString)) {
      const date = new Date(dateString);
      return !isNaN(date.getTime());
    }
    
    return false;
  };

  const handleDiscard = () => {
    if (hasUnsavedChanges) {
      const residenceId = form.getValues("residenceId");
      if (residenceId) {
        navigateTo(`/developer/residences/${slug}?tab=inventory`);
      } else {
        navigateTo("/units");
      }
    } else {
      const residenceId = form.getValues("residenceId");
      if (residenceId) {
        router.push(`/developer/residences/${slug}?tab=inventory`);
      } else {
        router.push("/units");
      }
    }
  };

  const handleDelete = async () => {
    const unitId = form.getValues("id");
    if (!unitId) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/${API_VERSION}/units/${unitId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete unit: ${response.status}`);
      }

      toast.success("Unit deleted successfully");
      const residenceId = form.getValues("residenceId");
      if (residenceId) {
        router.push(`/developer/residences/${slug}?tab=inventory`);
      } else {
        router.push("/units");
      }
      router.refresh();
    } catch (error) {
      toast.error("Failed to delete unit");
    }
  };

  const handleStatusChange = async (newStatus: UnitStatusType) => {
    const unitId = form.getValues("id");
    if (!unitId) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/${API_VERSION}/units/${unitId}/status`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update status: ${response.status}`);
      }

      form.setValue("status", newStatus, { shouldDirty: true });
      toast.success(`Unit status updated to ${newStatus}`);
      router.refresh();
    } catch (error) {
      toast.error("Failed to update unit status");
    }
  };

  const renderStatusBadge = () => {
    if (!isEditing) return null;

    const status = form.watch("status");
    if (!status) return null;

    return (
      <Badge
        className={`${getStatusBadgeStyle(status)} px-4 py-1.5 text-sm font-medium`}
      >
        {status}
      </Badge>
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
                This action cannot be undone. This will permanently delete the unit and all associated data.
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

  const handleSave = useCallback(() => {
    if (!isSaveEnabled()) {
      toast.error("Please fill in all required fields correctly");
      return;
    }

    onSubmit(form.getValues());
  }, [form, onSubmit, isSaveEnabled]);

  // Loading state se sada hendluje u EditUnitPage, ne ovde

  // Poboljšani useEffect za postavljanje residence ID iz slug-a u create modu
  useEffect(() => {
    const setResidenceFromSlug = async () => {
      if (slug && !form.getValues('residenceId')) {
        const residenceId = await fetchResidenceFromSlug();
        if (residenceId) {
          form.setValue('residenceId', residenceId, { shouldDirty: true });
          console.log("Residence ID set from slug:", residenceId);
        } else {
          toast.error("Failed to fetch residence info");
        }
      }
    };
    setResidenceFromSlug();
  }, [slug, form, fetchResidenceFromSlug]);

  return (
    <div className="w-full py-8">
      <FormHeader
        title={isEditing ? form.watch("name") || "Edit unit" : "Add new unit"}
        titleContent={renderStatusBadge()}
        extraButtons={renderDeleteButton()}
        onSave={handleSave}
        onDiscard={handleDiscard}
        saveButtonText={isEditing ? "Save changes" : "Add Unit"}
        saveButtonDisabled={!isSaveEnabled()}
        isSubmitting={isSubmitting}
      />

      <div className="w-full mx-auto custom-form">
        <Form {...form}>
          <form className="space-y-6">
            {/* Basic Information */}
            <div className=" ">
              <h2 className="text-lg font-bold sm:text-2xl text-sans mb-4">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Unit Name <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter unit name" {...field} />
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
                      <FormLabel>
                        Unit Type <span className="text-destructive">*</span>
                      </FormLabel>
                      <Select
                        disabled={loadingUnitTypes}
                        onValueChange={field.onChange}
                        value={field.value || ""}
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
                    <FormItem className="md:col-span-2">
                      <FormLabel>
                        Transaction Type <span className="text-destructive">*</span>
                      </FormLabel>
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

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Unit Title</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter unit title"
                          className="min-h-[100px]"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Property Details */}
            <div className=" ">
              <h2 className="text-lg font-bold sm:text-2xl text-sans mb-4">Property Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="bedroom"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bedrooms</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="e.g. 2"
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
                    name="floor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Floor</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="e.g. 5"
                            {...field}
                            value={field.value || ""}
                          />
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
                            onChange={(e) =>
                              field.onChange(e.target.value ? Number(e.target.value) : undefined)
                            }
                            value={field.value || ""}
                          />
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
                            placeholder="85"
                            {...field}
                            onChange={(e) =>
                              field.onChange(e.target.value ? Number(e.target.value) : undefined)
                            }
                            value={field.value || ""}
                          />
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
                          <Input
                            type="text"
                            placeholder="e.g. 2"
                            {...field}
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

            {/* Pricing Information */}
            <div className=" ">
              <h2 className="text-lg font-bold sm:text-2xl text-sans mb-4">Pricing Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="regularPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Regular Price <span className="text-destructive">*</span>
                      </FormLabel>
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
                          onChange={(e) =>
                            field.onChange(e.target.value ? Number(e.target.value) : undefined)
                          }
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
                          value={field.value ? field.value.split("T")[0] : ""}
                          onChange={(e) =>
                            field.onChange(e.target.value ? new Date(e.target.value).toISOString() : "")
                          }
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
                          value={field.value ? field.value.split("T")[0] : ""}
                          onChange={(e) =>
                            field.onChange(e.target.value ? new Date(e.target.value).toISOString() : "")
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Service Types */}
            <div className=" ">
              <h2 className="text-lg font-bold sm:text-2xl text-sans mb-4">Service Types</h2>
              <div className="space-y-4">
                {form.watch("services")?.map((service, index) => (
                  <div key={index} className="flex gap-4 items-end">
                    <FormField
                      control={form.control}
                      name={`services.${index}.name`}
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
                      name={`services.${index}.amount`}
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
                      onClick={() => removeService(index)}
                      className="mb-2"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                <Button type="button" variant="outline" onClick={addService} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Service Type
                </Button>
              </div>
            </div>

            {/* Characteristics */}
            <div className=" ">
              <h2 className="text-lg font-bold sm:text-2xl text-sans mb-4">Characteristics</h2>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add characteristic (e.g. Balcony, Sea View)"
                    value={newCharacteristic}
                    onChange={(e) => setNewCharacteristic(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
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
                      className="flex items-center gap-1   px-2 py-1 rounded-md bg-secondary border border-border"
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
            <div className=" ">
              <h2 className="text-lg font-bold sm:text-2xl text-sans mb-4">About</h2>
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
            <div className=" ">
              <h2 className="text-lg font-bold sm:text-2xl text-sans mb-4">Gallery</h2>
              <div className="space-y-4">
                <MultipleImageUpload
                  onChange={setImages}
                  onFeaturedChange={setFeaturedImage}
                  maxImages={10}
                  maxSizePerImage={5}
                  initialImages={initialImages}
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
    </div>
  );
};

export default UnitForm;