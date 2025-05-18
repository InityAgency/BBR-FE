"use client";

import type React from "react";
import { useState, useEffect, useCallback, useMemo } from "react";
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import FormHeader from "@/components/admin/Headers/FormHeader";
import ImageUpload from "@/components/admin/Forms/ImageUpload";
import UnsavedChangesWarning from "../../Forms/UnsavedChangesWarning";
import DiscardModal from "@/components/admin/Modals/DiscardModal";
import { useDiscardWarning } from "@/hooks/useDiscardWarning";
import { rankingCategorySchema, type RankingCategoryFormValues } from "@/app/schemas/ranking-category";
import { Trash2 } from "lucide-react";
import { API_BASE_URL, API_VERSION } from "@/app/constants/api";
import type { RankingCategoryFormData, RankingCategoryStatus } from "@/app/types/models/RankingCategory";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

// Import RankingCriteriaWeights component
import RankingCriteriaWeights, { type CriteriaWeight } from "@/components/admin/RankingCategory/Forms/RankingCriteriaWeights";

// Types
interface RankingCategoryTypeApiResponse {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

interface EntityOption {
  id: string;
  name?: string;
  title?: string;
}

interface MediaUploadResponse {
  data: {
    id: string;
    url: string;
  };
  statusCode: number;
  message: string;
}

interface RankingCategoryFormProps {
  initialData?: Partial<RankingCategoryFormData>;
  isEditing?: boolean;
  initialCriteriaWeights?: CriteriaWeight[];
}

interface EntityState {
  options: EntityOption[];
  page: number;
  hasMore: boolean;
  loading: boolean;
  searching: boolean;
  searchQuery: string;
}

// New interface for criteria weights API response
interface CriteriaWeightApiResponse {
  id: string;
  rankingCriteriaId: string;
  weight: number;
  isDefault: boolean;
  rankingCriteria: {
    id: string;
    name: string;
    description?: string;
  };
}

// Constants
const STATUS_STYLES: Record<RankingCategoryStatus, string> = {
  ACTIVE: "bg-green-900/20 hover:bg-green-900/40 text-green-300 border-green-900/50",
  DRAFT: "bg-gray-900/20 hover:bg-gray-900/40 text-gray-300 border-gray-900/50",
  DELETED: "bg-red-900/20 hover:bg-red-900/40 text-red-300 border-red-900/50",
};

const ENTITY_API_ROUTES: Record<string, string> = {
  City: `${API_BASE_URL}/api/v1/public/cities`,
  Lifestyle: `${API_BASE_URL}/api/${API_VERSION}/lifestyles`,
  Brand: `${API_BASE_URL}/api/${API_VERSION}/brands`,
  "Geographical Area": `${API_BASE_URL}/api/${API_VERSION}/continents`,
  Country: `${API_BASE_URL}/api/v1/public/countries`,
};

const ALLOWED_STATUSES: RankingCategoryStatus[] = ["DRAFT", "ACTIVE", "DELETED"];
const ITEMS_PER_PAGE = 20;

const RankingCategoryForm: React.FC<RankingCategoryFormProps> = ({ 
  initialData = {}, 
  isEditing = false,
  initialCriteriaWeights = []
}) => {
  const router = useRouter();

  // State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageValid, setImageValid] = useState(!!initialData?.featuredImageId);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [rankingCategoryTypeOptions, setRankingCategoryTypeOptions] = useState<RankingCategoryTypeApiResponse[]>([]);
  const [loadingRankingCategoryTypes, setLoadingRankingCategoryTypes] = useState(true);
  const [imageChanged, setImageChanged] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [entityComboboxOpen, setEntityComboboxOpen] = useState(false);
  
  // State for criteria weights
  const [criteriaWeights, setCriteriaWeights] = useState<CriteriaWeight[]>(initialCriteriaWeights);
  const [initialCriteriaWeightsState, setInitialCriteriaWeightsState] = useState<CriteriaWeight[]>(initialCriteriaWeights);
  const [isLoadingCriteriaWeights, setIsLoadingCriteriaWeights] = useState(false);
  const [isCreatingWithCriteria, setIsCreatingWithCriteria] = useState(false);
  
  // Entity state - consolidated
  const [entityState, setEntityState] = useState<EntityState>({
    options: [],
    page: 1,
    hasMore: true,
    loading: false,
    searching: false,
    searchQuery: "",
  });

  // Form setup
  const form = useForm<RankingCategoryFormValues>({
    resolver: zodResolver(rankingCategorySchema),
    defaultValues: {
      name: initialData.name || "",
      description: initialData.description || "",
      title: initialData.title || "",
      rankingCategoryTypeId: initialData.rankingCategoryTypeId || "",
      residenceLimitation: initialData.residenceLimitation || 0,
      rankingPrice: initialData.rankingPrice || 0,
      status: initialData.status || (isEditing ? "DRAFT" : "ACTIVE"),
      featuredImageId: initialData.featuredImageId || undefined,
      entityId: initialData.entityId || "",
    },
    mode: "onChange",
  });

  // Watched values
  const selectedCategoryTypeId = form.watch("rankingCategoryTypeId");
  const selectedEntityId = form.watch("entityId");

  // Computed values
  const selectedCategoryType = useMemo(() => {
    return rankingCategoryTypeOptions.find((type) => type.id === selectedCategoryTypeId)?.name;
  }, [selectedCategoryTypeId, rankingCategoryTypeOptions]);

  const selectedEntity = useMemo(() => {
    return entityState.options.find((option) => option.id === selectedEntityId);
  }, [entityState.options, selectedEntityId]);

  // Check if criteria weights have changed
  const criteriaWeightsChanged = useMemo(() => {
    if (initialCriteriaWeightsState.length !== criteriaWeights.length) return true;
    
    return criteriaWeights.some(current => {
      const initial = initialCriteriaWeightsState.find(init => init.rankingCriteriaId === current.rankingCriteriaId);
      return !initial || 
             initial.weight !== current.weight || 
             initial.isDefault !== current.isDefault;
    });
  }, [criteriaWeights, initialCriteriaWeightsState]);

  const hasUnsavedChanges = form.formState.isDirty || imageChanged || criteriaWeightsChanged;
  const requiresEntity = selectedCategoryType && ENTITY_API_ROUTES[selectedCategoryType];

  // Validation for criteria weights
  const criteriaValidation = useMemo(() => {
    if (criteriaWeights.length === 0) {
      return { isValid: true, message: "" };
    }
    
    const totalWeight = criteriaWeights.reduce((sum, criteria) => sum + criteria.weight, 0);
    const defaultCount = criteriaWeights.filter(c => c.isDefault).length;
    
    if (totalWeight !== 100) {
      return { isValid: false, message: "Total weight must be exactly 100%" };
    }
    
    if (defaultCount > 5) {
      return { isValid: false, message: "Maximum 5 default criteria allowed" };
    }
    
    return { isValid: true, message: "" };
  }, [criteriaWeights]);

  const isFormValid = useMemo(() => {
    const values = form.getValues();
    const hasRequiredFields =
      values.name?.trim().length >= 2 &&
      values.rankingCategoryTypeId &&
      values.title?.trim().length > 0;

    const hasValidImage = isEditing || imageValid;
    const hasRequiredEntity = !requiresEntity || values.entityId;
    
    // For any mode, criteria must be valid if any are added/exist
    const criteriaValid = criteriaWeights.length === 0 || criteriaValidation.isValid;

    return hasRequiredFields && hasValidImage && hasRequiredEntity && criteriaValid;
  }, [form.watch(), imageValid, isEditing, requiresEntity, criteriaValidation.isValid, criteriaWeights.length]);

  const canSave = useMemo(() => {
    return isFormValid && hasUnsavedChanges && !isSubmitting;
  }, [isFormValid, hasUnsavedChanges, isSubmitting]);

  // Fetch existing criteria weights for edit mode
  const fetchCriteriaWeights = useCallback(async (rankingCategoryId: string) => {
    if (!rankingCategoryId) return;

    try {
      setIsLoadingCriteriaWeights(true);
      const response = await fetch(
        `${API_BASE_URL}/api/${API_VERSION}/ranking-categories/${rankingCategoryId}/criteria-weights`,
        {
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          // No criteria weights found - this is okay
          setInitialCriteriaWeightsState(initialCriteriaWeights);
          setCriteriaWeights(initialCriteriaWeights);
          return;
        }
        throw new Error(`Failed to fetch criteria weights: ${response.status}`);
      }

      const data = await response.json();
      const criteriaWeights: CriteriaWeight[] = (data.data || []).map((item: CriteriaWeightApiResponse) => ({
        rankingCriteriaId: item.rankingCriteriaId,
        weight: item.weight,
        isDefault: item.isDefault,
        name: item.rankingCriteria.name,
      }));

      setInitialCriteriaWeightsState(criteriaWeights);
      setCriteriaWeights(criteriaWeights);
    } catch (error) {
      console.error("Error fetching criteria weights:", error);
      toast.error("Failed to load ranking criteria");
    } finally {
      setIsLoadingCriteriaWeights(false);
    }
  }, []);

  // Entity fetching logic
  const fetchEntities = useCallback(async (
    categoryType: string,
    page: number = 1,
    searchQuery: string = "",
    reset: boolean = false
  ) => {
    const apiUrl = ENTITY_API_ROUTES[categoryType];
    if (!apiUrl) return [];

    try {
      const url = new URL(apiUrl);
      url.searchParams.append("limit", ITEMS_PER_PAGE.toString());
      url.searchParams.append("page", page.toString());
      
      if (searchQuery.trim()) {
        url.searchParams.append("query", searchQuery.trim());
      }

      const response = await fetch(url.toString(), {
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch entities: ${response.status}`);
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error("Error fetching entity options:", error);
      toast.error(`Failed to load ${categoryType.toLowerCase()} options`);
      return [];
    }
  }, []);

  // Function to create criteria weights
  const createCriteriaWeights = async (rankingCategoryId: string) => {
    if (criteriaWeights.length === 0) {
      return true; // No criteria to create
    }

    try {
      const payload = {
        criteria: criteriaWeights.map(criteria => ({
          rankingCriteriaId: criteria.rankingCriteriaId,
          weight: criteria.weight,
          isDefault: criteria.isDefault,
        }))
      };

      const response = await fetch(
        `${API_BASE_URL}/api/${API_VERSION}/ranking-categories/${rankingCategoryId}/criteria-weights`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to create criteria weights");
      }

      return true;
    } catch (error) {
      console.error("Error creating criteria weights:", error);
      throw error;
    }
  };

  // Function to update criteria weights
  const updateCriteriaWeights = async (rankingCategoryId: string) => {
    try {
      const payload = {
        criteria: criteriaWeights.map(criteria => ({
          rankingCriteriaId: criteria.rankingCriteriaId,
          weight: criteria.weight,
          isDefault: criteria.isDefault,
        }))
      };

      const response = await fetch(
        `${API_BASE_URL}/api/${API_VERSION}/ranking-categories/${rankingCategoryId}/criteria-weights`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to update criteria weights");
      }

      return true;
    } catch (error) {
      console.error("Error updating criteria weights:", error);
      throw error;
    }
  };

  // Fetch criteria weights when editing (but only if not passed as props)
  useEffect(() => {
    if (isEditing && initialData.id && initialCriteriaWeights.length === 0) {
      fetchCriteriaWeights(initialData.id);
    }
  }, [isEditing, initialData.id, fetchCriteriaWeights, initialCriteriaWeights.length]);

  // Load initial entities when category type changes
  useEffect(() => {
    if (!selectedCategoryType || !ENTITY_API_ROUTES[selectedCategoryType]) {
      setEntityState(prev => ({
        ...prev,
        options: [],
        page: 1,
        hasMore: true,
        searchQuery: "",
      }));
      // Only reset entityId if not in editing mode with existing entityId
      if (!isEditing || !initialData.entityId) {
        form.setValue("entityId", "");
      }
      return;
    }

    const loadInitialEntities = async () => {
      setEntityState(prev => ({ ...prev, loading: true }));
      
      const entities = await fetchEntities(selectedCategoryType, 1);
      
      setEntityState(prev => ({
        ...prev,
        options: entities,
        page: 1,
        hasMore: entities.length === ITEMS_PER_PAGE,
        loading: false,
        searchQuery: "",
      }));

      // Set initial entityId value in edit mode if not already set
      if (isEditing && initialData.entityId && !form.getValues().entityId) {
        form.setValue("entityId", initialData.entityId);
      }
    };

    loadInitialEntities();
    
    // Reset entityId only when changing category type (not on initial load in edit mode)
    if (!isEditing || form.getValues().rankingCategoryTypeId !== initialData.rankingCategoryTypeId) {
      form.setValue("entityId", "");
    }
  }, [selectedCategoryType, fetchEntities, form, isEditing, initialData.entityId, initialData.rankingCategoryTypeId]);

  // Search entities with debouncing
  const searchEntities = useCallback(async (searchQuery: string) => {
    if (!selectedCategoryType) return;

    setEntityState(prev => ({ ...prev, searching: true, searchQuery }));
    
    const entities = await fetchEntities(selectedCategoryType, 1, searchQuery);
    
    setEntityState(prev => ({
      ...prev,
      options: entities,
      page: 1,
      hasMore: entities.length === ITEMS_PER_PAGE,
      searching: false,
    }));
  }, [selectedCategoryType, fetchEntities]);

  // Load more entities
  const loadMoreEntities = useCallback(async () => {
    if (!selectedCategoryType || entityState.loading || !entityState.hasMore) return;

    setEntityState(prev => ({ ...prev, loading: true }));
    
    const nextPage = entityState.page + 1;
    const entities = await fetchEntities(selectedCategoryType, nextPage, entityState.searchQuery);
    
    setEntityState(prev => ({
      ...prev,
      options: [...prev.options, ...entities],
      page: nextPage,
      hasMore: entities.length === ITEMS_PER_PAGE,
      loading: false,
    }));
  }, [selectedCategoryType, entityState.page, entityState.searchQuery, entityState.loading, entityState.hasMore, fetchEntities]);

  // Ensure entity is loaded when initialData.entityId is set but not found in options
  useEffect(() => {
    if (isEditing && initialData.entityId && entityState.options.length > 0) {
      const selectedEntity = entityState.options.find(option => option.id === initialData.entityId);
      if (!selectedEntity && selectedCategoryType && ENTITY_API_ROUTES[selectedCategoryType]) {
        // If the selected entity is not in current options, we need to load more or search for it
        // This handles cases where the initial entity might be on a different page
        const loadEntityIfNeeded = async () => {
          // Try to load more pages until we find the entity or exhaust all options
          let currentPage = entityState.page + 1;
          let found = false;
          
          while (entityState.hasMore && !found && currentPage <= 5) { // Limit to 5 pages max
            const entities = await fetchEntities(selectedCategoryType, currentPage);
            const foundEntity = entities.find((e: { id: string | undefined; }) => e.id === initialData.entityId);
            
            if (foundEntity) {
              found = true;
              setEntityState(prev => ({
                ...prev,
                options: [...prev.options, ...entities],
                page: currentPage,
                hasMore: entities.length === ITEMS_PER_PAGE,
              }));
            }
            
            currentPage++;
            
            if (entities.length < ITEMS_PER_PAGE) {
              break; // No more entities to load
            }
          }
        };
        
        loadEntityIfNeeded();
      }
    }
  }, [isEditing, initialData.entityId, entityState.options, selectedCategoryType, entityState.hasMore, entityState.page, fetchEntities]);

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (entityState.searchQuery !== undefined) {
        searchEntities(entityState.searchQuery);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [entityState.searchQuery, searchEntities]);

  // Effects
  // Fetch ranking category types
  useEffect(() => {
    const fetchRankingCategoryTypes = async () => {
      try {
        setLoadingRankingCategoryTypes(true);
        const response = await fetch(`${API_BASE_URL}/api/${API_VERSION}/ranking-category-types`, {
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch ranking category types: ${response.status}`);
        }

        const data = await response.json();
        setRankingCategoryTypeOptions(data.data || []);
        
        // Set initial value in edit mode once options are loaded
        if (isEditing && initialData.rankingCategoryTypeId && !form.getValues().rankingCategoryTypeId) {
          form.setValue("rankingCategoryTypeId", initialData.rankingCategoryTypeId);
        }
      } catch (error) {
        console.error("Error fetching ranking category types:", error);
        toast.error("Failed to load ranking category types");
      } finally {
        setLoadingRankingCategoryTypes(false);
      }
    };

    fetchRankingCategoryTypes();
  }, [isEditing, initialData.rankingCategoryTypeId, form]);

  // Fetch image blob for display
  useEffect(() => {
    let cancelled = false;

    const fetchImageBlob = async () => {
      if (!initialData.featuredImageId || typeof initialData.featuredImageId !== "string") return;

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/${API_VERSION}/media/${initialData.featuredImageId}/content`,
          {
            credentials: "include",
            headers: {
              Accept: "*/*",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch image: ${response.status}`);
        }

        if (cancelled) return;

        const arrayBuffer = await response.arrayBuffer();
        const blob = new Blob([arrayBuffer], { type: "image/jpeg" });
        const url = URL.createObjectURL(blob);
        setImageUrl(url);
      } catch (error) {
        if (!cancelled) {
          console.error("Error fetching image:", error);
          toast.error("Failed to load image");
        }
      }
    };

    fetchImageBlob();

    return () => {
      cancelled = true;
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [initialData.featuredImageId]);

  // Track image changes
  useEffect(() => {
    const currentImageId = form.watch("featuredImageId");
    if (currentImageId !== initialData.featuredImageId && currentImageId !== undefined) {
      setImageChanged(true);
    }
  }, [form.watch("featuredImageId"), initialData.featuredImageId]);

  // Handlers
  const uploadImage = async (file: File): Promise<{ id: string; url: string }> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_BASE_URL}/api/${API_VERSION}/media?type=RANKING_CATEGORY`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Failed to upload image: ${response.status}`);
    }

    const data = (await response.json()) as MediaUploadResponse;
    return { id: data.data.id, url: data.data.url };
  };

  const validateForm = (): boolean => {
    const values = form.getValues();
    let isValid = true;

    form.clearErrors();

    if (!values.name?.trim()) {
      form.setError("name", { type: "required", message: "Name is required" });
      isValid = false;
    }

    if (!values.rankingCategoryTypeId) {
      form.setError("rankingCategoryTypeId", { type: "required", message: "Ranking category type is required" });
      isValid = false;
    }

    if (!values.title?.trim()) {
      form.setError("title", { type: "required", message: "Title is required" });
      isValid = false;
    }

    if (!isEditing && !values.featuredImageId && !initialData.featuredImageId) {
      form.setError("featuredImageId", { type: "required", message: "Featured image is required" });
      isValid = false;
    }

    if (requiresEntity && !values.entityId) {
      form.setError("entityId", { type: "required", message: `${selectedCategoryType} is required` });
      isValid = false;
    }

    // Validate criteria if provided
    if (criteriaWeights.length > 0 && !criteriaValidation.isValid) {
      toast.error(criteriaValidation.message);
      isValid = false;
    }

    return isValid;
  };

  const onSubmit = async (data: RankingCategoryFormValues) => {
    if (!validateForm()) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setIsSubmitting(true);
      const hasCriteriaChanges = isEditing ? criteriaWeightsChanged : criteriaWeights.length > 0;
      setIsCreatingWithCriteria(hasCriteriaChanges);

      let imageId = typeof initialData.featuredImageId === "string" ? initialData.featuredImageId : undefined;
      if (imageChanged && data.featuredImageId instanceof File) {
        try {
          const uploadResult = await uploadImage(data.featuredImageId);
          imageId = uploadResult.id;
        } catch (error) {
          toast.error("Failed to upload image");
          return;
        }
      }

      const payload = {
        name: data.name.trim(),
        description: data.description?.trim() || undefined,
        rankingCategoryTypeId: data.rankingCategoryTypeId,
        residenceLimitation: data.residenceLimitation,
        rankingPrice: data.rankingPrice,
        status: isEditing ? data.status : "ACTIVE",
        title: data.title.trim(),
        entityId: data.entityId || undefined,
        featuredImageId: imageId,
      };

      // Step 1: Create/Update ranking category
      const apiUrl = isEditing
        ? `${API_BASE_URL}/api/${API_VERSION}/ranking-categories/${initialData.id}`
        : `${API_BASE_URL}/api/${API_VERSION}/ranking-categories`;

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
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to ${isEditing ? "update" : "create"} ranking category`);
      }

      const rankingCategoryResponse = await response.json();
      const rankingCategoryId = isEditing ? initialData.id : rankingCategoryResponse.data.id;

      // Step 2: Create/Update criteria weights if there are changes
      if (hasCriteriaChanges) {
        try {
          if (isEditing) {
            await updateCriteriaWeights(rankingCategoryId);
          } else {
            await createCriteriaWeights(rankingCategoryId);
          }
          toast.success(`Ranking category and criteria weights ${isEditing ? "updated" : "created"} successfully!`);
        } catch (error) {
          // If criteria creation/update fails, we still have the ranking category created/updated
          toast.error(`Ranking category ${isEditing ? "updated" : "created"}, but failed to ${isEditing ? "update" : "create"} criteria weights. You can modify them later.`);
          console.error("Criteria weights operation failed:", error);
        }
      } else {
        toast.success(`Ranking category ${isEditing ? "updated" : "created"} successfully!`);
      }

      router.push(isEditing ? `/rankings/ranking-categories/${initialData.id}` : "/rankings/ranking-categories");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(error instanceof Error ? error.message : "Failed to save ranking category");
    } finally {
      setIsSubmitting(false);
      setIsCreatingWithCriteria(false);
    }
  };

  const handleDelete = async () => {
    if (!initialData?.id) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/${API_VERSION}/ranking-categories/${initialData.id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete ranking category: ${response.status}`);
      }

      toast.success("Ranking category deleted successfully");
      router.push("/rankings/ranking-categories");
    } catch (error) {
      console.error("Error deleting ranking category:", error);
      toast.error("Failed to delete ranking category");
    } finally {
      setShowDeleteDialog(false);
    }
  };

  const handleStatusChange = async (newStatus: RankingCategoryStatus) => {
    if (!initialData?.id) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/${API_VERSION}/ranking-categories/${initialData.id}/status`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update status: ${response.status}`);
      }

      form.setValue("status", newStatus, { shouldDirty: true });
      toast.success(`Ranking category status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update ranking category status");
    }
  };

  const handleDiscard = () => {
    if (hasUnsavedChanges) {
      navigateTo("/rankings/ranking-categories");
    } else {
      router.push("/rankings/ranking-categories");
    }
  };

  const handleSave = useCallback(() => {
    if (!canSave) {
      if (!imageValid && !isEditing) {
        toast.error("Please upload a featured image");
      } else if (!hasUnsavedChanges) {
        toast.error("No changes have been made");
      } else if (!criteriaValidation.isValid && criteriaWeights.length > 0) {
        toast.error(criteriaValidation.message);
      } else {
        toast.error("Please fill in all required fields correctly");
      }
      return;
    }

    onSubmit(form.getValues());
  }, [canSave, form, onSubmit, isEditing, imageValid, hasUnsavedChanges, criteriaValidation]);

  // Setup discard warning hook
  const { showDiscardModal, handleConfirmDiscard, handleCancelDiscard, navigateTo } = useDiscardWarning({
    hasUnsavedChanges,
    onDiscard: () => {
      // Additional cleanup if needed
    },
  });

  // Render helpers
  const renderStatusBadge = () => {
    if (!isEditing) return null;

    return (
      <FormField
        control={form.control}
        name="status"
        render={({ field }) => (
          <Select onValueChange={handleStatusChange} value={field.value} disabled={false}>
            <SelectTrigger className="w-auto border-0 p-0 h-auto hover:bg-transparent focus:ring-0">
              <Badge
                className={`${STATUS_STYLES[field.value]} px-4 py-1.5 text-sm font-medium transition-all duration-200 cursor-pointer hover:opacity-80`}
              >
                {field.value}
              </Badge>
            </SelectTrigger>
            <SelectContent>
              {ALLOWED_STATUSES.map((status) => (
                <SelectItem key={status} value={status} className="text-sm">
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
                This action cannot be undone. This will permanently delete the ranking category and all associated data.
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
        title={isEditing ? initialData.name || "Edit ranking category" : "Add new ranking category"}
        titleContent={renderStatusBadge()}
        extraButtons={renderDeleteButton()}
        onSave={handleSave}
        onDiscard={handleDiscard}
        saveButtonText={
          isCreatingWithCriteria 
            ? isEditing 
              ? "Updating category and criteria..." 
              : "Creating category and criteria..." 
            : isEditing 
              ? "Save changes" 
              : "Add Ranking Category"
        }
        saveButtonDisabled={!canSave}
        isSubmitting={isSubmitting}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">General Information</h2>
          <Form {...form}>
            <div className="space-y-6 mb-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Name <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter full name" {...field} />
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
                      <Textarea placeholder="Enter description" className="min-h-[120px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rankingCategoryTypeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Ranking Category Type <span className="text-destructive">*</span>
                    </FormLabel>
                    <Select 
                      disabled={loadingRankingCategoryTypes} 
                      onValueChange={(value) => {
                        field.onChange(value);
                        // Mark form as dirty when category type changes
                        form.setValue("rankingCategoryTypeId", value, { shouldDirty: true });
                      }} 
                      value={field.value}
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

              {requiresEntity && (
                <FormField
                  control={form.control}
                  name="entityId"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>
                        {selectedCategoryType} <span className="text-destructive">*</span>
                      </FormLabel>
                      <Popover open={entityComboboxOpen} onOpenChange={setEntityComboboxOpen}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={entityComboboxOpen}
                              className={cn("w-full justify-between", !field.value && "text-muted-foreground")}
                              disabled={entityState.loading && entityState.options.length === 0}
                            >
                              {field.value && selectedEntity
                                ? selectedEntity.name || selectedEntity.title
                                : `Select ${selectedCategoryType?.toLowerCase()}`}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0" align="start">
                          <Command shouldFilter={false}>
                            <CommandInput
                              placeholder={`Search ${selectedCategoryType?.toLowerCase()}...`}
                              value={entityState.searchQuery}
                              onValueChange={(value) => {
                                setEntityState(prev => ({ ...prev, searchQuery: value }));
                              }}
                            />
                            <CommandList>
                              <CommandEmpty>
                                {entityState.searching ? "Searching..." : `No ${selectedCategoryType?.toLowerCase()} found.`}
                              </CommandEmpty>
                              <CommandGroup>
                                {entityState.options.map((option) => (
                                  <CommandItem
                                    key={option.id}
                                    value={option.id}
                                    onSelect={() => {
                                      form.setValue("entityId", option.id, { shouldDirty: true });
                                      setEntityComboboxOpen(false);
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        field.value === option.id ? "opacity-100" : "opacity-0"
                                      )}
                                    />
                                    {option.name || option.title}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                              {entityState.hasMore && (
                                <div className="p-2 border-t">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={loadMoreEntities}
                                    disabled={entityState.loading}
                                    className="w-full"
                                  >
                                    {entityState.loading ? "Loading..." : "Load more"}
                                  </Button>
                                </div>
                              )}
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Card Title <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter card title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="residenceLimitation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Residence Limitation <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        placeholder="Enter residence limitation"
                        {...field}
                        onChange={(e) => field.onChange(Number.parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rankingPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Ranking Price <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="Enter ranking price"
                          className="pl-7"
                          {...field}
                          onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || 0)}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </Form>

          <h2 className="text-xl font-semibold mb-4">Featured Image</h2>
          <Form {...form}>
            <FormField
              control={form.control}
              name="featuredImageId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Featured Image <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <div>
                      <ImageUpload
                        onChange={(file) => {
                          field.onChange(file);
                          setImageValid(!!file);
                          setImageChanged(true);
                        }}
                        value={
                          typeof field.value === "string" ? imageUrl : field.value instanceof File ? field.value : null
                        }
                        supportedFormats={["JPG", "JPEG", "PNG", "WEBP"]}
                        maxSize={5}
                        required={!isEditing}
                        onValidation={setImageValid}
                      />
                      <p className="text-xs text-muted-foreground mt-2">
                        JPG, JPEG, PNG and WEBP formats are supported
                        <br />
                        Max. upload size - 5MB
                      </p>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Form>
        </div>
        
        <div>
          {/* Show criteria weights for both creation and editing */}
          {isLoadingCriteriaWeights ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
          ) : (
            <RankingCriteriaWeights
              onChange={setCriteriaWeights}
              initialCriteria={criteriaWeights}
              rankingCategoryId={isEditing ? initialData.id : undefined}
            />
          )}
        </div>
      </div>

      <DiscardModal isOpen={showDiscardModal} onClose={handleCancelDiscard} onConfirm={handleConfirmDiscard} />
      <UnsavedChangesWarning hasUnsavedChanges={hasUnsavedChanges} />
    </>
  );
};

export default RankingCategoryForm;