"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import type { z } from "zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import LocationSelector from "@/components/admin/LocationSelector";

import FormHeader from "../../Headers/FormHeader";
import ImageUpload from "../../Forms/ImageUpload";
import UnsavedChangesWarning from "../../Forms/UnsavedChangesWarning";
import DiscardModal from "../../Modals/DiscardModal";
import { useDiscardWarning } from "@/hooks/useDiscardWarning";
import residence, { 
  residenceSchema, 
  ResidenceFormValues, 
  initialResidenceValues, 
  keyFeatureSchema,
  DevelopmentStatus,
  RentalPotential
} from "../../../../app/schemas/residence";
import { Check, Trash2, X } from "lucide-react";
import { API_BASE_URL, API_VERSION } from "@/app/constants/api";
import { useDebounce } from "@/hooks/useDebounce";
import Image from "next/image";
import MultipleImageUpload, { UploadedImage } from "../../Forms/MultipleImageUpload";

interface ResidenceFormProps {
  initialData?: Partial<ResidenceFormValues>;
  isEditing?: boolean;
}

interface Brand {
  id: string;
  name: string;
  description?: string;
  status: string;
  logo?: {
    id: string;
    originalFileName: string;
  };
}

interface Country {
  id: string;
  name: string;
  code: string;
  flag: string;
}

interface City {
  id: string;
  name: string;
  countryId: string;
}

// Koristimo tip iz postojećeg keyFeatureSchema
type KeyFeature = z.infer<typeof keyFeatureSchema>;

interface Amenity {
  id: string;
  name: string;
}

export default function ResidenceForm({ initialData = {}, isEditing = false }: ResidenceFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  
  // State za brendove
  const [brands, setBrands] = useState<Brand[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoadingBrands, setIsLoadingBrands] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const debouncedSearch = useDebounce(searchQuery, 300);

  // State za države
  const [countries, setCountries] = useState<Country[]>([]);
  const [countrySearchQuery, setCountrySearchQuery] = useState("");
  const [isLoadingCountries, setIsLoadingCountries] = useState(false);
  const [countryCurrentPage, setCountryCurrentPage] = useState(1);
  const [hasMoreCountries, setHasMoreCountries] = useState(true);
  const countrySearchInputRef = useRef<HTMLInputElement>(null);
  const debouncedCountrySearch = useDebounce(countrySearchQuery, 300);

  // State za gradove
  const [cities, setCities] = useState<City[]>([]);
  const [citySearchQuery, setCitySearchQuery] = useState("");
  const [isLoadingCities, setIsLoadingCities] = useState(false);
  const [cityCurrentPage, setCityCurrentPage] = useState(1);
  const [hasMoreCities, setHasMoreCities] = useState(true);
  const citySearchInputRef = useRef<HTMLInputElement>(null);
  const debouncedCitySearch = useDebounce(citySearchQuery, 300);

  // Dodajemo state za key features
  const [keyFeatures, setKeyFeatures] = useState<KeyFeature[]>([]);
  const [isLoadingKeyFeatures, setIsLoadingKeyFeatures] = useState(false);

  const [images, setImages] = useState<UploadedImage[]>([]);
  const [featuredImage, setFeaturedImage] = useState<UploadedImage | null>(null);

  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [isLoadingAmenities, setIsLoadingAmenities] = useState(false);

  const form = useForm<ResidenceFormValues>({
    resolver: zodResolver(residenceSchema),
    defaultValues: {
      ...initialResidenceValues,
      ...initialData,
    },
  });

  // Provera da li forma ima nesačuvane promene
  const hasUnsavedChanges = form.formState.isDirty;

  // Hook za upozorenje o nesačuvanim promenama
  const {
    showDiscardModal,
    handleConfirmDiscard,
    handleCancelDiscard,
    navigateTo,
  } = useDiscardWarning({
    hasUnsavedChanges,
    onDiscard: () => {
      // Dodatne akcije pri odbacivanju ako su potrebne
    },
  });

  // Provera da li je forma validna za čuvanje
  const isSaveEnabled = useCallback(() => {
    return form.formState.isDirty && !form.formState.isValidating && Object.keys(form.formState.errors).length === 0;
  }, [form.formState]);

  // Funkcija za učitavanje brendova
  const fetchBrands = useCallback(async (page: number, search: string = "", reset: boolean = false) => {
    try {
      setIsLoadingBrands(true);
      const response = await fetch(
        `${API_BASE_URL}/api/${API_VERSION}/brands?page=${page}&limit=10${search ? `&query=${search}` : ""}`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch brands");
      }

      const data = await response.json();
      
      setBrands(prev => reset ? data.data : [...prev, ...data.data]);
      setHasMore(data.pagination.page < data.pagination.totalPages);
      setCurrentPage(data.pagination.page);
    } catch (error) {
      console.error("Error fetching brands:", error);
      toast.error("Failed to load brands");
    } finally {
      setIsLoadingBrands(false);
    }
  }, []);

  // Učitaj brendove kada se komponenta mountuje
  useEffect(() => {
    fetchBrands(1, "", true);
  }, [fetchBrands]);

  // Učitaj brendove kada se pretraga promeni
  useEffect(() => {
    setCurrentPage(1);
    fetchBrands(1, debouncedSearch, true);
  }, [debouncedSearch, fetchBrands]);

  // Handler za scroll (infinite loading)
  const handleBrandScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    if (
      target.scrollHeight - target.scrollTop <= target.clientHeight + 20 &&
      !isLoadingBrands &&
      hasMore
    ) {
      fetchBrands(currentPage + 1, searchQuery);
    }
  }, [currentPage, fetchBrands, hasMore, isLoadingBrands, searchQuery]);

  // Funkcija za učitavanje država
  const fetchCountries = useCallback(async (page: number, search: string = "", reset: boolean = false) => {
    try {
      setIsLoadingCountries(true);
      const response = await fetch(
        `${API_BASE_URL}/api/v1/countries?page=${page}&limit=10${search ? `&query=${search}` : ""}`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch countries");
      }

      const data = await response.json();
      
      setCountries(prev => reset ? data.data : [...prev, ...data.data]);
      setHasMoreCountries(data.pagination.page < data.pagination.totalPages);
      setCountryCurrentPage(data.pagination.page);
    } catch (error) {
      console.error("Error fetching countries:", error);
      toast.error("Failed to load countries");
    } finally {
      setIsLoadingCountries(false);
    }
  }, []);

  // Učitaj države kada se komponenta mountuje
  useEffect(() => {
    fetchCountries(1, "", true);
  }, [fetchCountries]);

  // Učitaj države kada se pretraga promeni
  useEffect(() => {
    setCountryCurrentPage(1);
    fetchCountries(1, debouncedCountrySearch, true);
  }, [debouncedCountrySearch, fetchCountries]);

  // Handler za scroll (infinite loading) za države
  const handleCountryScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    if (
      target.scrollHeight - target.scrollTop <= target.clientHeight + 20 &&
      !isLoadingCountries &&
      hasMoreCountries
    ) {
      fetchCountries(countryCurrentPage + 1, countrySearchQuery);
    }
  }, [countryCurrentPage, fetchCountries, hasMoreCountries, isLoadingCountries, countrySearchQuery]);

  // Funkcija za učitavanje gradova
  const fetchCities = useCallback(async (page: number, search: string = "", reset: boolean = false) => {
    if (!form.watch("countryId")) return;

    try {
      setIsLoadingCities(true);
      const response = await fetch(
        `${API_BASE_URL}/api/v1/cities?page=${page}&limit=10${search ? `&query=${search}` : ""}&countryId=${form.watch("countryId")}`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch cities");
      }

      const data = await response.json();
      
      setCities(prev => reset ? data.data : [...prev, ...data.data]);
      setHasMoreCities(data.pagination.page < data.pagination.totalPages);
      setCityCurrentPage(data.pagination.page);
    } catch (error) {
      console.error("Error fetching cities:", error);
      toast.error("Failed to load cities");
    } finally {
      setIsLoadingCities(false);
    }
  }, [form]);

  // Učitaj gradove kada se promeni država
  useEffect(() => {
    const countryId = form.watch("countryId");
    if (countryId) {
      setCities([]); // Reset gradova
      setCityCurrentPage(1);
      fetchCities(1, "", true);
    }
  }, [form.watch("countryId"), fetchCities]);

  // Učitaj gradove kada se pretraga promeni
  useEffect(() => {
    if (form.watch("countryId")) {
      setCityCurrentPage(1);
      fetchCities(1, debouncedCitySearch, true);
    }
  }, [debouncedCitySearch, fetchCities, form]);

  // Handler za scroll (infinite loading)
  const handleCityScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    if (
      target.scrollHeight - target.scrollTop <= target.clientHeight + 20 &&
      !isLoadingCities &&
      hasMoreCities
    ) {
      fetchCities(cityCurrentPage + 1, citySearchQuery);
    }
  }, [cityCurrentPage, fetchCities, hasMoreCities, isLoadingCities, citySearchQuery]);

  // Funkcija za dohvatanje key features sa keširanje
  const fetchKeyFeatures = useCallback(async () => {
    const cacheKey = 'residence-key-features';
    const cacheExpiry = 24 * 60 * 60 * 1000; // 24 sata

    try {
      // Prvo proveravamo keš
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < cacheExpiry) {
          setKeyFeatures(data);
          return;
        }
        localStorage.removeItem(cacheKey);
      }

      setIsLoadingKeyFeatures(true);
      const response = await fetch(
        `${API_BASE_URL}/api/${API_VERSION}/key-features?limit=30&page=1`,
        { credentials: "include" }
      );

      if (!response.ok) throw new Error("Failed to fetch key features");

      const data = await response.json();
      const features = data.data;

      // Čuvamo u kešu
      localStorage.setItem(cacheKey, JSON.stringify({
        data: features,
        timestamp: Date.now()
      }));

      setKeyFeatures(features);
    } catch (error) {
      console.error("Error fetching key features:", error);
      toast.error("Failed to load key features");
    } finally {
      setIsLoadingKeyFeatures(false);
    }
  }, []);

  // Učitavamo key features kada se komponenta mountuje
  useEffect(() => {
    fetchKeyFeatures();
  }, [fetchKeyFeatures]);

  // Funkcija za dohvatanje amenities
  const fetchAmenities = useCallback(async () => {
    const cacheKey = 'residence-amenities';
    const cacheExpiry = 24 * 60 * 60 * 1000; // 24 sata

    try {
      // Prvo proveravamo keš
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < cacheExpiry) {
          setAmenities(data);
          return;
        }
        localStorage.removeItem(cacheKey);
      }

      setIsLoadingAmenities(true);
      const response = await fetch(
        `${API_BASE_URL}/api/${API_VERSION}/amenities?limit=30&page=1`,
        { credentials: "include" }
      );

      if (!response.ok) throw new Error("Failed to fetch amenities");

      const data = await response.json();
      const fetchedAmenities = data.data;

      // Čuvamo u kešu
      localStorage.setItem(cacheKey, JSON.stringify({
        data: fetchedAmenities,
        timestamp: Date.now()
      }));

      setAmenities(fetchedAmenities);
    } catch (error) {
      console.error("Error fetching amenities:", error);
      toast.error("Failed to load amenities");
    } finally {
      setIsLoadingAmenities(false);
    }
  }, []);

  // Učitavamo amenities kada se komponenta mountuje
  useEffect(() => {
    fetchAmenities();
  }, [fetchAmenities]);

  // Modifikujemo handleSave da prvo uploaduje slike
  const handleSave = async () => {
    try {
      setIsSubmitting(true);
      const values = form.getValues();
      
      // Prvo uploadujemo slike
      const uploadedImages = await Promise.all(
        images.map(async (image) => {
          const formData = new FormData();
          formData.append('file', image.file);
          
          const response = await fetch(
            `${API_BASE_URL}/api/${API_VERSION}/media?type=RESIDENCE`,
            {
              method: 'POST',
              credentials: 'include',
              body: formData,
            }
          );
          
          if (!response.ok) {
            throw new Error(`Failed to upload image ${image.file.name}`);
          }
          
          const data = await response.json();
          return {
            mediaId: data.data.id,
            isFeatured: image.isFeatured,
            order: image.order
          };
        })
      );

      // Izdvajamo samo potrebne podatke
      const dataToSend = {
        ...values,
        country: undefined,
        city: undefined,
        keyFeatures: values.keyFeatures?.map(feature => feature.id) || [],
        amenities: values.amenities?.map(amenity => amenity.id) || [],
        mainGallery: uploadedImages.map(img => img.mediaId),
        featuredImage: uploadedImages.find(img => img.isFeatured)?.mediaId || null,
        developmentStatus: values.developmentStatus as string,
        rentalPotential: values.rentalPotential as string,
        yearBuilt: values.yearBuilt,
        floorSqft: values.floorSqft,
        staffRatio: values.staffRatio,
        avgPricePerUnit: values.avgPricePerUnit,
        avgPricePerSqft: values.avgPricePerSqft
      };

      const endpoint = isEditing && initialData?.id
        ? `${API_BASE_URL}/api/${API_VERSION}/residences/${initialData.id}`
        : `${API_BASE_URL}/api/${API_VERSION}/residences`;

      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${isEditing ? 'update' : 'create'} residence`);
      }

      toast.success(isEditing ? 'Residence updated successfully!' : 'Residence created successfully!');
      router.push('/residences');
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handler za brisanje
  const handleDelete = async () => {
    if (!initialData?.id) return;
    
    try {
      setIsSubmitting(true);
      const response = await fetch(`${API_BASE_URL}/api/${API_VERSION}/residences/${initialData.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to delete residence');
      }

      toast.success('Residence deleted successfully');
      router.push('/residences');
      router.refresh();
    } catch (error) {
      toast.error('Failed to delete residence');
    } finally {
      setIsSubmitting(false);
      setShowDeleteDialog(false);
    }
  };

  // Handler za odbacivanje promena
  const handleDiscard = () => {
    if (hasUnsavedChanges) {
      navigateTo("/residences");
    } else {
      router.push("/residences");
    }
  };

  // Render status bedža
  const renderStatusBadge = () => {
    if (!isEditing) return null;

    return (
      <Badge variant="outline" className="ml-2">
        {form.watch("status")}
      </Badge>
    );
  };

  // Render akcija za status
  const renderStatusActions = () => {
    if (!isEditing) return null;

    return (
      <>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            className="bg-green-900/20 hover:bg-green-900/40 text-green-300 border-green-900/50"
            onClick={() => form.setValue("status", "ACTIVE", { shouldDirty: true })}
          >
            <Check className="h-4 w-4 mr-2" />
            Approve
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="bg-red-900/20 hover:bg-red-900/40 text-red-300 border-red-900/50"
            onClick={() => setShowRejectDialog(true)}
          >
            <X className="h-4 w-4 mr-2" />
            Reject
          </Button>
        </div>

        <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure you want to reject this residence?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. The residence will be marked as rejected.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  form.setValue("status", "DELETED", { shouldDirty: true });
                  setShowRejectDialog(false);
                }}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Reject
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    );
  };

  // Render dugmeta za brisanje
  const renderDeleteButton = () => {
    if (!isEditing) return null;

    return (
      <>
        <Button
          variant="destructive"
          onClick={() => setShowDeleteDialog(true)}
          disabled={isSubmitting}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>

        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure you want to delete this residence?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the residence
                and all associated data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
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
          title={isEditing ? initialData.name || "Edit residence" : "Add new residence"}
          titleContent={renderStatusBadge()}
          titleActions={renderStatusActions()}
          extraButtons={renderDeleteButton()}
          onSave={handleSave}
          onDiscard={handleDiscard}
          saveButtonText={isEditing ? "Save changes" : "Add Residence"}
          saveButtonDisabled={!isSaveEnabled()}
          isSubmitting={isSubmitting}
        />

      <div className="container mx-auto py-6">
        <Form {...form}>
          <form className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* General Information */}
              <div>
                <h2 className="text-lg font-semibold mb-4">General Information</h2>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name <span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                          <Input placeholder="Enter residence name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="websiteUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website URL</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="https://example.com" 
                            value={field.value || ""} 
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            name={field.name}
                            ref={field.ref}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="brandId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Brand <span className="text-destructive">*</span></FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          onOpenChange={(open) => {
                            if (open && searchInputRef.current) {
                              setTimeout(() => {
                                searchInputRef.current?.focus();
                              }, 100);
                            }
                          }}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a brand" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <div className="px-2 py-2 sticky top-0 bg-background z-10">
                              <Input
                                ref={searchInputRef}
                                placeholder="Search brands..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="h-8"
                                onKeyDown={(e) => e.stopPropagation()}
                              />
                            </div>
                            <div 
                              className="max-h-[300px] overflow-y-auto"
                              onScroll={handleBrandScroll}
                            >
                              {isLoadingBrands && brands.length === 0 ? (
                                <div className="px-2 py-2 text-sm text-muted-foreground">
                                  Loading brands...
                                </div>
                              ) : brands.length === 0 ? (
                                <div className="px-2 py-2 text-sm text-muted-foreground">
                                  No brands found
                                </div>
                              ) : (
                                brands.map((brand) => (
                                  <SelectItem 
                                    key={brand.id} 
                                    value={brand.id}
                                    className="cursor-pointer"
                                  >
                                    <div className="flex items-center gap-2">
                                      {brand.logo && (
                                        <Image
                                          src={`${API_BASE_URL}/api/${API_VERSION}/media/${brand.logo.id}/content`}
                                          alt={brand.name}
                                          width={24}
                                          height={24}
                                          className="rounded-sm object-contain"
                                        />
                                      )}
                                      <span>{brand.name}</span>
                                    </div>
                                  </SelectItem>
                                ))
                              )}
                              {isLoadingBrands && brands.length > 0 && (
                                <div className="px-2 py-2 text-sm text-muted-foreground text-center">
                                  Loading more brands...
                                </div>
                              )}
                            </div>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="countryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country <span className="text-destructive">*</span></FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          onOpenChange={(open) => {
                            if (open && countrySearchInputRef.current) {
                              setTimeout(() => {
                                countrySearchInputRef.current?.focus();
                              }, 100);
                            }
                          }}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a country" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <div className="px-2 py-2 sticky top-0 bg-background z-10">
                              <Input
                                ref={countrySearchInputRef}
                                placeholder="Search countries..."
                                value={countrySearchQuery}
                                onChange={(e) => setCountrySearchQuery(e.target.value)}
                                className="h-8"
                                onKeyDown={(e) => e.stopPropagation()}
                              />
                            </div>
                            <div 
                              className="max-h-[300px] overflow-y-auto"
                              onScroll={handleCountryScroll}
                            >
                              {isLoadingCountries && countries.length === 0 ? (
                                <div className="px-2 py-2 text-sm text-muted-foreground">
                                  Loading countries...
                                </div>
                              ) : countries.length === 0 ? (
                                <div className="px-2 py-2 text-sm text-muted-foreground">
                                  No countries found
                                </div>
                              ) : (
                                countries.map((country) => (
                                  <SelectItem 
                                    key={country.id} 
                                    value={country.id}
                                    className="cursor-pointer"
                                  >
                                    <div className="flex items-center justify-between w-full">
                                      <div className="flex items-center gap-2">
                                        <img
                                          src={country.flag}
                                          alt={`${country.name} flag`}
                                          className="w-4 h-4 rounded-sm object-cover"
                                        />
                                        <span>{country.name}</span>
                                      </div>
                                      <span className="text-xs text-muted-foreground">
                                        {country.code}
                                      </span>
                                    </div>
                                  </SelectItem>
                                ))
                              )}
                              {isLoadingCountries && countries.length > 0 && (
                                <div className="px-2 py-2 text-sm text-muted-foreground text-center">
                                  Loading more countries...
                                </div>
                              )}
                            </div>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="cityId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          City <span className="text-destructive">*</span>
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={!form.watch("countryId")}
                          onOpenChange={(open) => {
                            if (open && citySearchInputRef.current) {
                              setTimeout(() => {
                                citySearchInputRef.current?.focus();
                              }, 100);
                            }
                          }}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder={form.watch("countryId") ? "Select a city" : "Please select a country first"} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <div className="px-2 py-2 sticky top-0 bg-background z-10">
                              <Input
                                ref={citySearchInputRef}
                                placeholder="Search cities..."
                                value={citySearchQuery}
                                onChange={(e) => setCitySearchQuery(e.target.value)}
                                className="h-8"
                                onKeyDown={(e) => e.stopPropagation()}
                              />
                            </div>
                            <div 
                              className="max-h-[300px] overflow-y-auto"
                              onScroll={(e) => {
                                const target = e.currentTarget;
                                if (
                                  target.scrollHeight - target.scrollTop <= target.clientHeight + 20 &&
                                  !isLoadingCities &&
                                  hasMoreCities
                                ) {
                                  fetchCities(cityCurrentPage + 1, citySearchQuery);
                                }
                              }}
                            >
                              {isLoadingCities && cities.length === 0 ? (
                                <div className="px-2 py-2 text-sm text-muted-foreground">
                                  Loading cities...
                                </div>
                              ) : cities.length === 0 ? (
                                <div className="px-2 py-2 text-sm text-muted-foreground">
                                  No cities found
                                </div>
                              ) : (
                                cities.map((city) => (
                                  <SelectItem 
                                    key={city.id} 
                                    value={city.id}
                                    className="cursor-pointer"
                                  >
                                    <div className="flex items-center gap-2">
                                      <span>{city.name}</span>
                                    </div>
                                  </SelectItem>
                                ))
                              )}
                              {isLoadingCities && cities.length > 0 && (
                                <div className="px-2 py-2 text-sm text-muted-foreground text-center">
                                  Loading more cities...
                                </div>
                              )}
                            </div>
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
                      <FormItem>
                        <FormLabel>Description <span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                          <Textarea placeholder="Enter residence description" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Location Information */}
              <div>
                <h2 className="text-lg font-semibold mb-4">Location</h2>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address <span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                          <LocationSelector
                            value={{
                              address: field.value,
                              latitude: form.watch("latitude"),
                              longitude: form.watch("longitude"),
                            }}
                            onChange={(location) => {
                              field.onChange(location.address);
                              form.setValue("latitude", location.latitude);
                              form.setValue("longitude", location.longitude);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Budget Information */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Budget Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="budgetStartRange"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Budget Start Range <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <Input type="number" min="0" placeholder="Enter starting budget" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="budgetEndRange"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Budget End Range <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <Input type="number" min="0" placeholder="Enter ending budget" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Development Information */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Development Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="developmentStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Development Status <span className="text-destructive">*</span></FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select development status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(DevelopmentStatus).map(([key, value]) => (
                            <SelectItem key={value} value={value as string}>
                              {key.split('_').map(word => 
                                word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                              ).join(' ')}
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
                  name="rentalPotential"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rental Potential</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ""}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select rental potential" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(RentalPotential).map(([key, value]) => (
                            <SelectItem key={value} value={value as string}>
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
                  name="yearBuilt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year Built</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="Enter year built"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="floorSqft"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Floor Area (sq. ft.)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01"
                          placeholder="Enter floor area"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="staffRatio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Staff to Residence Ratio</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01"
                          placeholder="Enter staff ratio"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="avgPricePerUnit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Average Price per Unit</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01"
                          placeholder="Enter average price per unit"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="avgPricePerSqft"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Average Price per sq. ft.</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01"
                          placeholder="Enter average price per sq. ft."
                          {...field}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4 col-span-3">
                  <div className="flex flex-row gap-6">
                    <FormField
                      control={form.control}
                      name="petFriendly"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 w-full">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Pet Friendly?</FormLabel>
                            <FormDescription>
                              Da li je objekat prilagođen za kućne ljubimce
                            </FormDescription>
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

                    <FormField
                      control={form.control}
                      name="disabledFriendly"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 w-full">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Accessible for people with disabilities?</FormLabel>
                            <FormDescription>
                              Da li je objekat prilagođen osobama sa invaliditetom
                            </FormDescription>
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
                </div>
              </div>
            </div>

            {/* Key Features Section */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Key Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="keyFeatures"
                  render={() => (
                    <FormItem>
                      {isLoadingKeyFeatures ? (
                        <div className="text-sm text-muted-foreground">Loading key features...</div>
                      ) : (
                        <div className="grid grid-cols-2 gap-4">
                          {keyFeatures.map((feature) => (
                            <FormField
                              key={feature.id}
                              control={form.control}
                              name="keyFeatures"
                              render={({ field }) => {
                                const selectedFeatures = field.value || [];
                                const isSelected = selectedFeatures.some(
                                  (f) => f.id === feature.id
                                );

                                return (
                                  <FormItem
                                    key={feature.id}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={isSelected}
                                        onCheckedChange={(checked) => {
                                          const newFeatures = checked
                                            ? [...selectedFeatures, feature]
                                            : selectedFeatures.filter(
                                                (f) => f.id !== feature.id
                                              );
                                          field.onChange(newFeatures);
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal cursor-pointer">
                                      {feature.name}
                                    </FormLabel>
                                  </FormItem>
                                );
                              }}
                            />
                          ))}
                        </div>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Amenities Section */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Amenities</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="amenities"
                  render={() => (
                    <FormItem>
                      {isLoadingAmenities ? (
                        <div className="text-sm text-muted-foreground">Loading amenities...</div>
                      ) : (
                        <div className="grid grid-cols-2 gap-4">
                          {amenities.map((amenity) => (
                            <FormField
                              key={amenity.id}
                              control={form.control}
                              name="amenities"
                              render={({ field }) => {
                                const selectedAmenities = field.value || [];
                                const isSelected = selectedAmenities.some(
                                  (a) => a.id === amenity.id
                                );

                                return (
                                  <FormItem
                                    key={amenity.id}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={isSelected}
                                        onCheckedChange={(checked) => {
                                          const newAmenities = checked
                                            ? [...selectedAmenities, amenity]
                                            : selectedAmenities.filter(
                                                (a) => a.id !== amenity.id
                                              );
                                          field.onChange(newAmenities);
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal cursor-pointer">
                                      {amenity.name}
                                    </FormLabel>
                                  </FormItem>
                                );
                              }}
                            />
                          ))}
                        </div>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Images Section */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Images</h2>
              <div className="space-y-4">
                <MultipleImageUpload
                  onChange={setImages}
                  onFeaturedChange={setFeaturedImage}
                  maxImages={10}
                  maxSizePerImage={2}
                />
              </div>
            </div>
          </form>
        </Form>
      </div>

      {/* Modals */}
      <DiscardModal
        isOpen={showDiscardModal}
        onClose={handleCancelDiscard}
        onConfirm={handleConfirmDiscard}
      />

      {/* Warning for unsaved changes */}
      <UnsavedChangesWarning hasUnsavedChanges={hasUnsavedChanges} />
    </>
  );
}
