"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { ChevronRight, ChevronLeft, Check, ChevronsUpDown } from "lucide-react";

// UI Components
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Custom Components
import LocationSelector from "@/components/web/Forms/LocationSelector";
import MultipleImageUpload from "@/components/web/Forms/MultipleImageUpload";
import { CountryAndCity } from "@/components/web/Forms/CountryAndCity";
import { MultiSelect } from "@/components/web/Forms/MultiSelect";

// Constants and schemas
import { API_BASE_URL, API_VERSION } from "@/app/constants/api";
import {
  residenceSchema,
  ResidenceFormValues,
  initialResidenceValues,
  DevelopmentStatus,
  RentalPotential
} from "@/app/schemas/residence";

import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Step definitions
const STEPS = [
  { id: 1, name: "General information", description: "Basic details about the residence" },
  { id: 2, name: "Key Features", description: "Features and development information" },
  { id: 3, name: "Visuals", description: "Gallery and video tour" },
  { id: 4, name: "Amenities", description: "Available amenities and highlights" },
] as const;

// Schema za svaki korak - ISPRAVKA: video tour nije obavezno
const step1Schema = z.object({
  name: z.string().min(1, "Name is required"),
  websiteUrl: z.string().url().optional().or(z.literal("")),
  brandId: z.string().min(1, "Brand is required"),
  countryId: z.string().min(1, "Country is required"),
  cityId: z.string().min(1, "City is required"),
  subtitle: z.string().min(1, "Subtitle is required"),
  description: z.string().min(1, "Description is required"),
  budgetStartRange: z.string().min(1, "Budget start range is required"),
  budgetEndRange: z.string().min(1, "Budget end range is required"),
  address: z.string().min(1, "Address is required"),
  latitude: z.string(),
  longitude: z.string(),
});

const step2Schema = z.object({
  developmentStatus: z.nativeEnum(DevelopmentStatus),
  yearBuilt: z.string().optional(),
  floorSqft: z.string().optional(),
  staffRatio: z.number().optional(),
  avgPricePerUnit: z.string().optional(),
  avgPricePerSqft: z.string().optional(),
  rentalPotential: z.nativeEnum(RentalPotential).optional(),
  keyFeatures: z.array(z.object({
    id: z.string(),
    name: z.string(),
  })).optional(),
  petFriendly: z.boolean().optional(),
  disabledFriendly: z.boolean().optional(),
});

// ISPRAVKA: Video tour je potpuno opciono - potpuno preskoči validaciju
const step3Schema = z.object({
  // Namerno ostavljamo prazan objekat jer video tour ne treba validaciju
});

const step4Schema = z.object({
  amenities: z.array(z.object({
    id: z.string(),
    name: z.string(),
  })).optional(),
  highlightedAmenities: z.array(z.object({
    id: z.string(),
    order: z.number(),
  })).max(3, "Maximum 3 highlighted amenities allowed").optional(),
});

interface Brand {
  id: string;
  name: string;
  logo?: { id: string };
}

interface KeyFeature {
  id: string;
  name: string;
}

interface Amenity {
  id: string;
  name: string;
}

// Dodajemo propse za edit mod
interface MultiStepResidenceFormProps {
  initialValues?: Partial<ResidenceFormValues>;
  isEdit?: boolean;
  initialImages?: any[];
}

export default function MultiStepResidenceForm({ initialValues, isEdit, initialImages }: MultiStepResidenceFormProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [residenceId, setResidenceId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Data states
  const [brands, setBrands] = useState<Brand[]>([]);
  const [keyFeatures, setKeyFeatures] = useState<KeyFeature[]>([]);
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [images, setImages] = useState<any[]>([]);
  const [featuredImage, setFeaturedImage] = useState<any>(null);

  // Form setup - ISPRAVKA: dodajemo pravilno mapiranje highlightedAmenities
  const form = useForm<ResidenceFormValues>({
    resolver: zodResolver(residenceSchema.omit({ videoTourUrl: true }).extend({
      videoTourUrl: z.string().nullable().optional()  // Override-ujemo video tour da bude potpuno opciono i može biti null
    })),
    defaultValues: isEdit && initialValues ? {
      ...initialResidenceValues,
      ...initialValues,
      // KLJUČNA ISPRAVKA: mapiramo highlightedAmenities iz API format-a
      highlightedAmenities: initialValues.highlightedAmenities?.map((ha: any) => ({
        id: ha.amenity?.id || ha.id,  // Pokrivamo oba slučaja
        order: ha.order || 0,
      })) || [],
    } : { 
      ...initialResidenceValues, 
      latitude: "0", 
      longitude: "0" 
    },
    mode: "onChange",
  });

  // ISPRAVKA: Postaviti residenceId u edit modu
  useEffect(() => {
    if (isEdit && initialValues?.id) {
      setResidenceId(initialValues.id);
    }
  }, [isEdit, initialValues?.id]);

  // ISPRAVKA: Inicijalizacija slika u edit modu
  useEffect(() => {
    if (isEdit && initialImages && initialImages.length > 0) {
      setImages(initialImages);
      const featured = initialImages.find(img => img.isFeatured);
      if (featured) {
        setFeaturedImage(featured);
      }
    }
  }, [isEdit, initialImages]);

  // Get schema for current step
  const getStepSchema = (step: number) => {
    switch (step) {
      case 1:
        return step1Schema;
      case 2:
        return step2Schema;
      case 3:
        return step3Schema;
      case 4:
        return step4Schema;
      default:
        return z.object({});
    }
  };

  // Validate current step
  const validateCurrentStep = async () => {
    const stepSchema = getStepSchema(currentStep);
    const values = form.getValues();

    console.log("Validating step", currentStep, "with values:", values);

    try {
      await stepSchema.parseAsync(values);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.log("Validation errors:", error.errors);
        error.errors.forEach((err) => {
          form.setError(err.path.join('.') as any, {
            type: 'manual',
            message: err.message,
          });
        });
      }
      return false;
    }
  };

  // Fetch initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Fetch brands
        const brandsResponse = await fetch(
          `${API_BASE_URL}/api/${API_VERSION}/brands?limit=100`,
          { credentials: "include" }
        );
        const brandsData = await brandsResponse.json();
        setBrands(brandsData.data || []);

        // Fetch key features
        const featuresResponse = await fetch(
          `${API_BASE_URL}/api/${API_VERSION}/key-features?limit=100`,
          { credentials: "include" }
        );
        const featuresData = await featuresResponse.json();
        setKeyFeatures(featuresData.data || []);

        // Fetch amenities
        const amenitiesResponse = await fetch(
          `${API_BASE_URL}/api/${API_VERSION}/amenities?limit=100`,
          { credentials: "include" }
        );
        const amenitiesData = await amenitiesResponse.json();
        setAmenities(amenitiesData.data || []);
      } catch (error) {
        console.error("Error loading initial data:", error);
        toast.error("Failed to load form data");
      }
    };

    loadInitialData();
  }, []);

  // Handle step navigation
  const handleNext = async () => {
    const isValid = await validateCurrentStep();
    if (!isValid) {
      toast.error("Please fill in all required fields");
      return;
    }

    // EDIT MODE: UVEK radi updateResidence na Next
    if (isEdit) {
      await updateResidence();
      if (currentStep < STEPS.length) {
        setCurrentStep(currentStep + 1);
      }
      return;
    }

    // CREATE MODE: ponašaj se kao do sada
    if (currentStep === 1 && !residenceId) {
      // Create residence on first step
      await createResidence();
    } else if (currentStep < STEPS.length) {
      // Update residence on other steps
      await updateResidence();
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Create residence (Step 1)
  const createResidence = async () => {
    try {
      setIsSubmitting(true);
      const values = form.getValues();

      const dataToSend = {
        name: values.name,
        websiteUrl: values.websiteUrl || null,
        brandId: values.brandId,
        countryId: values.countryId,
        cityId: values.cityId,
        subtitle: values.subtitle,
        description: values.description,
        budgetStartRange: values.budgetStartRange,
        budgetEndRange: values.budgetEndRange,
        address: values.address,
        latitude: values.latitude,
        longitude: values.longitude,
        status: "PENDING",
      };

      const response = await fetch(`${API_BASE_URL}/api/${API_VERSION}/residences`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) throw new Error('Failed to create residence');

      const data = await response.json();
      setResidenceId(data.data.id);
      toast.success('Residence created successfully');
      setCurrentStep(2);
    } catch (error) {
      toast.error('Failed to create residence');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update residence (Steps 2-4 ili edit mode)
  const updateResidence = async () => {
    if (!residenceId) {
      console.error("No residenceId available for update");
      return;
    }

    try {
      setIsSubmitting(true);
      const values = form.getValues();
      let dataToSend: any = {};

      console.log("Current step:", currentStep);
      console.log("Form values:", values);

      // ISPRAVKA: U edit modu, potrebno je proslediti sva polja za svaki korak
      if (isEdit) {
        switch (currentStep) {
          case 1:
            dataToSend = {
              name: values.name,
              websiteUrl: values.websiteUrl || null,
              brandId: values.brandId,
              countryId: values.countryId,
              cityId: values.cityId,
              subtitle: values.subtitle,
              description: values.description,
              budgetStartRange: values.budgetStartRange,
              budgetEndRange: values.budgetEndRange,
              address: values.address,
              latitude: values.latitude,
              longitude: values.longitude,
            };
            break;
          case 2:
            dataToSend = {
              developmentStatus: values.developmentStatus,
              yearBuilt: values.yearBuilt || null,
              floorSqft: values.floorSqft || null,
              staffRatio: values.staffRatio || null,
              avgPricePerUnit: values.avgPricePerUnit || null,
              avgPricePerSqft: values.avgPricePerSqft || null,
              rentalPotential: values.rentalPotential || null,
              keyFeatures: values.keyFeatures?.map(f => f.id) || [],
              petFriendly: values.petFriendly || false,
              disabledFriendly: values.disabledFriendly || false,
            };
            break;
          case 3:
            const uploadedImages = await uploadImages();
            // ISPRAVKA: U create modu, pravilno postavi featured image
            const featuredImageId = featuredImage?.mediaId || 
                                   uploadedImages.find(img => img.isFeatured)?.mediaId || 
                                   uploadedImages[0]?.mediaId || 
                                   null;
            
            dataToSend = {
              mainGallery: uploadedImages.map((img, index) => ({
                id: img.mediaId,
                order: index,
              })),
              featuredImageId: featuredImageId,
              videoTourUrl: values.videoTourUrl || null,
            };
            console.log("Step 3 create mode data:", {
              featuredImage,
              featuredImageId,
              uploadedImages: uploadedImages.length
            });
            break;
          case 4:
            // ISPRAVKA: API očekuje { id, order } format, ne { amenityId, order }
            const highlightedAmenitiesForAPI = values.highlightedAmenities?.map(ha => ({
              id: ha.id,  // Vraćeno na id umesto amenityId
              order: ha.order
            })) || [];

            dataToSend = {
              amenities: values.amenities?.map(a => a.id) || [],
              highlightedAmenities: highlightedAmenitiesForAPI,
            };

            console.log("Step 4 data being sent:", {
              amenities: dataToSend.amenities,
              highlightedAmenities: dataToSend.highlightedAmenities,
              originalHighlighted: values.highlightedAmenities
            });
            break;
        }
      } else {
        // CREATE MODE - postojeća logika
        switch (currentStep) {
          case 2:
            dataToSend = {
              developmentStatus: values.developmentStatus,
              yearBuilt: values.yearBuilt || null,
              floorSqft: values.floorSqft || null,
              staffRatio: values.staffRatio || null,
              avgPricePerUnit: values.avgPricePerUnit || null,
              avgPricePerSqft: values.avgPricePerSqft || null,
              rentalPotential: values.rentalPotential || null,
              keyFeatures: values.keyFeatures?.map(f => f.id) || [],
              petFriendly: values.petFriendly || false,
              disabledFriendly: values.disabledFriendly || false,
            };
            break;
          case 3:
            const uploadedImages = await uploadImages();
            // ISPRAVKA: U edit modu, kombinuj postojeće i nove slike za featured
            const allImagesForFeatured = [...images.filter(img => 'mediaId' in img), ...uploadedImages];
            const featuredImageId = featuredImage?.mediaId || 
                                   allImagesForFeatured.find(img => img.isFeatured)?.mediaId || 
                                   allImagesForFeatured[0]?.mediaId || 
                                   null;
            
            dataToSend = {
              mainGallery: uploadedImages.map((img, index) => ({
                id: img.mediaId,
                order: index,
              })),
              featuredImageId: featuredImageId,
              videoTourUrl: values.videoTourUrl || null,
            };
            console.log("Step 3 edit mode data:", {
              featuredImage,
              featuredImageId,
              allImagesForFeatured: allImagesForFeatured.length,
              uploadedImages: uploadedImages.length
            });
            break;
          case 4:
            dataToSend = {
              amenities: values.amenities?.map(a => a.id) || [],
              highlightedAmenities: values.highlightedAmenities?.map(ha => ({
                amenityId: ha.id,
                order: ha.order
              })) || [],
            };
            break;
        }
      }

      console.log("Final data to send:", dataToSend);

      const response = await fetch(
        `${API_BASE_URL}/api/${API_VERSION}/residences/${residenceId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(dataToSend),
        }
      );

      console.log("API response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API error response:", errorText);
        throw new Error(`Failed to update residence: ${response.status} - ${errorText}`);
      }

      const responseData = await response.json();
      console.log("API success response:", responseData);

      toast.success('Progress saved');
    } catch (error) {
      console.error("Update error:", error);
      toast.error('Failed to save progress');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Upload images helper - ISPRAVKA: Čuvaj isFeatured informaciju
  const uploadImages = async () => {
    const uploadedImages = [];

    for (const image of images) {
      if ('file' in image) {
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

        if (response.ok) {
          const data = await response.json();
          uploadedImages.push({
            mediaId: data.data.id,
            isFeatured: image.isFeatured || false,  // Čuvaj featured status
            order: image.order || uploadedImages.length
          });
        }
      }
    }

    console.log("Uploaded images with featured info:", uploadedImages);
    return uploadedImages;
  };

  // Final submission
  const handlePublish = async () => {
    const isValid = await validateCurrentStep();
    if (!isValid) {
      toast.error("Please fill in all required fields");
      return;
    }

    await updateResidence();
    toast.success(isEdit ? "Residence updated successfully!" : "Residence submitted for review!");
    router.push("/developer/residences");
  };

  // Render step indicator
  const renderStepIndicator = () => (
    <div className="w-full max-w-4xl mb-4">
      <Tabs value={currentStep.toString()} className="w-full">
        <TabsList className="h-auto bg-secondary border">
          {STEPS.map((step) => (
            <TabsTrigger
              key={step.id}
              value={step.id.toString()}
              disabled={!residenceId && step.id > 1 && !isEdit}
              className={`
                data-[state=active]:text-white dark:data-[state=active]:bg-black/5 cursor-pointer border-transparent
                ${step.id < currentStep ? 'text-primary' : ''}
                ${step.id > currentStep && (!residenceId || step.id > 1) && !isEdit ? 'text-muted-foreground' : ''}
                py-2 px-4
              `}
              onClick={() => {
                if (residenceId || step.id === 1 || isEdit) {
                  if (step.id < currentStep || isEdit) {
                    setCurrentStep(step.id);
                  }
                }
              }}
            >
              <div className="flex items-center gap-2">
                {step.id < currentStep && (
                  <Check className="h-4 w-4" />
                )}
                <span className="font-medium">{step.name}</span>
              </div>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );

  // Render current step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <Step1Content form={form} brands={brands} />;
      case 2:
        return <Step2Content form={form} keyFeatures={keyFeatures} />;
      case 3:
        return <Step3Content form={form} images={images} setImages={setImages} featuredImage={featuredImage} setFeaturedImage={setFeaturedImage} initialImages={initialImages || []} />;
      case 4:
        return <Step4Content form={form} amenities={amenities} />;
      default:
        return null;
    }
  };

  return (
    <div className="py-8 w-full">
      <div className="mb-8">
        <h1 className="text-xl font-bold sm:text-2xl text-sans">
          {isEdit ? "Edit residence" : "Add new residence"}
        </h1>
        <p className="text-muted-foreground text-sm mt-2">
          {isEdit ? "Update your residence listing by modifying the information below" : "Create a new residence listing by following the steps below"}
        </p>
      </div>

      <div className="flex items-center justify-between">
        {renderStepIndicator()}
        <div className="flex items-center gap-4 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1 || isSubmitting}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          {currentStep < STEPS.length ? (
            <Button
              type="button"
              onClick={handleNext}
              disabled={isSubmitting}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handlePublish}
              disabled={isSubmitting}
              className="bg-primary"
            >
              {isEdit ? "Update residence" : "Publish residence"}
            </Button>
          )}
        </div>
      </div>
      
      <Form {...form}>
        <form className="space-y-8">
          {renderStepContent()}
        </form>
      </Form>
    </div>
  );
}

// Step 1 Component
interface Step1ContentProps {
  form: ReturnType<typeof useForm<ResidenceFormValues>>;
  brands: Brand[];
}

function Step1Content({ form, brands }: Step1ContentProps) {
  const [open, setOpen] = useState(false);

  // Get selected brand
  const selectedBrand = brands.find(brand => brand.id === form.watch("brandId"));

  return (
    <div className="space-y-6 custom-form grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-bold sm:text-2xl text-sans mb-4">Basic information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Residence name <span className="text-destructive">*</span></FormLabel>
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
              name="brandId"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Associated brand <span className="text-destructive">*</span></FormLabel>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={open}
                          className={cn(
                            "w-full justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {selectedBrand ? selectedBrand.name : "Select a brand"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0" align="start">
                      <Command shouldFilter={false}>
                        <CommandInput placeholder="Search brands..." />
                        <CommandList>
                          <CommandEmpty>No brand found.</CommandEmpty>
                          <CommandGroup>
                            {Array.isArray(brands) && brands.map((brand) => (
                              <CommandItem
                                key={brand.id}
                                value={brand.name}
                                onSelect={(currentValue) => {
                                  const selectedBrand = brands.find(
                                    b => b.name.toLowerCase() === currentValue.toLowerCase()
                                  );
                                  if (selectedBrand) {
                                    field.onChange(selectedBrand.id);
                                    setOpen(false);
                                  }
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    selectedBrand?.id === brand.id ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                {brand.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div>
          <h2 className="text-lg font-bold sm:text-2xl text-sans mb-4">Brief Overview</h2>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="subtitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Brief Subtitle <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="Ex. Ritz Carlton Residences Miami" {...field} />
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
                  <FormLabel>Brief overview <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter brief overview"
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div>
          <h2 className="text-lg font-bold sm:text-2xl text-sans mb-4">Budget Limitations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="budgetStartRange"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Budget start range <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} />
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
                  <FormLabel>Budget end range <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-bold sm:text-2xl text-sans mb-4">Location Details</h2>
        <div className="space-y-4">
          <div className="w-full">
            <CountryAndCity
              defaultCountryId={form.watch("countryId")}
              defaultCityId={form.watch("cityId")}
              onCountrySelect={(countryId) => {
                form.setValue("countryId", countryId, { shouldValidate: true });
              }}
              onCitySelect={(cityId) => {
                form.setValue("cityId", cityId, { shouldValidate: true });
              }}
            />
          </div>

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address <span className="text-destructive">*</span></FormLabel>
                <FormControl>
                  <LocationSelector
                    value={{
                      address: field.value || "",
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
  );
}

// Step 2 Component
interface Step2ContentProps {
  form: ReturnType<typeof useForm<ResidenceFormValues>>;
  keyFeatures: KeyFeature[];
}

function Step2Content({ form, keyFeatures }: Step2ContentProps) {
  return (
    <div className="space-y-6 custom-form">
      <div>
        <h2 className="text-lg font-bold sm:text-2xl text-sans mb-4">Key Features</h2>
        <p className="text-sm text-muted-foreground mb-6">
          They are necessary to attract potential buyers by showcasing what makes the residence stand out and why it is a desirable investment.
        </p>

        <FormField
          control={form.control}
          name="keyFeatures"
          render={() => (
            <FormItem>
              <div className="grid grid-cols-2 gap-4">
                {keyFeatures.map((feature) => (
                  <FormField
                    key={feature.id}
                    control={form.control}
                    name="keyFeatures"
                    render={({ field }) => {
                      const selectedFeatures = field.value || [];
                      const isSelected = selectedFeatures.some(f => f.id === feature.id);

                      return (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={(checked) => {
                                const newFeatures = checked
                                  ? [...selectedFeatures, feature]
                                  : selectedFeatures.filter(f => f.id !== feature.id);
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
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div>
        <h2 className="text-lg font-bold sm:text-2xl text-sans mb-4">Development Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="yearBuilt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Year Built</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="2024" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="developmentStatus"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Development status <span className="text-destructive">*</span></FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="w-full">
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
            name="floorSqft"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Floor are sq. ft.</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="0" {...field} />
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
                <FormLabel>Staff to residence ratio</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0"
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
                <FormLabel>Average price per unit.</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <Input type="number" placeholder="0" className="pl-8" {...field} />
                  </div>
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
                <FormLabel>Average price per sq. ft.</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <Input type="number" placeholder="0" className="pl-8" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="rentalPotential"
            render={({ field }) => (
              <FormItem className="col-span-2 w-full">
                <FormLabel>Rental potential</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl className="w-full">
                    <SelectTrigger>
                      <SelectValue placeholder="Select rental potential" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="w-full">
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
        </div>
      </div>

      <div>
        <h2 className="text-lg font-bold sm:text-2xl text-sans mb-4">Policies</h2>
        <div className="flex items-center gap-4">
          <FormField
            control={form.control}
            name="petFriendly"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 w-full">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Pet Friendly?</FormLabel>
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
  );
}

// Step 3 Component
interface Step3ContentProps {
  form: ReturnType<typeof useForm<ResidenceFormValues>>;
  images: any[];
  setImages: (images: any[]) => void;
  featuredImage: any;
  setFeaturedImage: (image: any) => void;
  initialImages?: any[];
}

function Step3Content({ form, images, setImages, featuredImage, setFeaturedImage, initialImages = [] }: Step3ContentProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold sm:text-2xl text-sans mb-2">Main Gallery</h2>
        <p className="text-muted-foreground mb-6">Maximum 10 photos</p>

        <MultipleImageUpload
          onChange={setImages}
          onFeaturedChange={setFeaturedImage}
          maxImages={10}
          maxSizePerImage={5}
          initialImages={initialImages}
        />
      </div>

      <div className="custom-form">
        <h2 className="text-lg font-bold sm:text-2xl text-sans mb-2">Video Tour</h2>
        <p className="text-muted-foreground mb-6">This is completely optional. You can add a video tour URL if available.</p>
        <FormField
          control={form.control}
          name="videoTourUrl"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="Enter video URL (optional - YouTube, Vimeo, etc.)"
                  value={field.value || ""}
                  onChange={(e) => {
                    // Očisti grešku kad korisnik počne da kuca
                    form.clearErrors("videoTourUrl");
                    field.onChange(e.target.value);
                  }}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                />
              </FormControl>
              <FormDescription>
                This field is completely optional. You can skip it or add any video URL later.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}

// Step 4 Component - ISPRAVKA: Pravilno filtriranje amenities za highlighting
interface Step4ContentProps {
  form: ReturnType<typeof useForm<ResidenceFormValues>>;
  amenities: Amenity[];
}

function Step4Content({ form, amenities }: Step4ContentProps) {
  const selectedAmenities = form.watch("amenities") || [];
  const highlightedAmenities = form.watch("highlightedAmenities") || [];

  // ISPRAVKA: Dodajemo useEffect da logujemo početno stanje
  useEffect(() => {
    console.log("Step4Content mounted with:", {
      selectedAmenities: selectedAmenities.length,
      highlightedAmenities,
      allAmenities: amenities.length
    });
  }, [selectedAmenities.length, highlightedAmenities, amenities.length]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold sm:text-2xl text-sans mb-4">Provide the full list of amenities nearby</h2>

        <FormField
          control={form.control}
          name="amenities"
          render={() => (
            <FormItem>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {amenities.map((amenity) => (
                  <FormField
                    key={amenity.id}
                    control={form.control}
                    name="amenities"
                    render={({ field }) => {
                      const selectedAmenities = field.value || [];
                      const isSelected = selectedAmenities.some(a => a.id === amenity.id);

                      return (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={(checked) => {
                                const newAmenities = checked
                                  ? [...selectedAmenities, amenity]
                                  : selectedAmenities.filter(a => a.id !== amenity.id);
                                field.onChange(newAmenities);

                                // Remove from highlighted if unchecked
                                if (!checked) {
                                  const currentHighlighted = form.getValues("highlightedAmenities") || [];
                                  form.setValue(
                                    "highlightedAmenities",
                                    currentHighlighted.filter(h => h.id !== amenity.id)
                                  );
                                }
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
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="custom-form">
        <h2 className="text-lg font-bold sm:text-2xl text-sans mb-4">Highlight top 3 amenities</h2>
        <p className="text-muted-foreground mb-6">
          Select up to 3 amenities from your selected list above to highlight as featured amenities. These will be displayed prominently on the residence page.
        </p>

        <FormField
          control={form.control}
          name="highlightedAmenities"
          render={({ field }) => {
            const currentSelectedAmenities = form.watch("amenities") || [];
            const selectedIds = (field.value || []).map(h => h.id);

            const handleToggleAmenity = (amenityId: string) => {
              console.log("Toggle amenity clicked:", amenityId);
              console.log("Current selectedIds:", selectedIds);
              
              const isCurrentlySelected = selectedIds.includes(amenityId);
              let newSelectedIds: string[];

              if (isCurrentlySelected) {
                // Remove amenity
                newSelectedIds = selectedIds.filter(id => id !== amenityId);
                console.log("Removing amenity, new list:", newSelectedIds);
              } else {
                // Add amenity (max 3)
                if (selectedIds.length < 3) {
                  newSelectedIds = [...selectedIds, amenityId];
                  console.log("Adding amenity, new list:", newSelectedIds);
                } else {
                  console.log("Cannot add amenity - already have 3");
                  toast.error("Maximum 3 amenities can be highlighted. Remove one first.");
                  return;
                }
              }

              const newHighlightedAmenities = newSelectedIds.map((id, index) => ({
                id: id,
                order: index
              }));

              console.log("Setting new highlighted amenities:", newHighlightedAmenities);
              field.onChange(newHighlightedAmenities);
            };

            console.log("Step4 render state:", {
              currentSelectedAmenities: currentSelectedAmenities.length,
              selectedIds,
              fieldValue: field.value
            });

            return (
              <FormItem>
                <FormLabel>Featured amenities (max 3)</FormLabel>
                <FormControl>
                  {currentSelectedAmenities.length === 0 ? (
                    <div className="text-sm text-muted-foreground p-4 border rounded-md bg-muted/50">
                      Please select at least one amenity from the list above before choosing featured amenities.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                          Click to select/deselect amenities for highlighting (max 3):
                        </div>
                        {selectedIds.length === 3 && (
                          <div className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-md">
                            Limit reached - remove one to add another
                          </div>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {currentSelectedAmenities.map((amenity) => {
                          const isHighlighted = selectedIds.includes(amenity.id);
                          const canSelect = selectedIds.length < 3;  // Može se dodati novi samo ako ima manje od 3
                          const canClick = isHighlighted || canSelect;  // Može se kliknuti ako je već highlighted ili ako može da se doda novi
                          
                          return (
                            <div
                              key={amenity.id}
                              onClick={() => canClick && handleToggleAmenity(amenity.id)}
                              className={cn(
                                "flex items-center space-x-3 p-3 border rounded-md transition-colors",
                                canClick ? "cursor-pointer hover:bg-secondary" : "cursor-not-allowed",
                                isHighlighted 
                                  ? "bg-primary/5 border-primary text-primary" 
                                  : "border",
                                !canClick && !isHighlighted && "opacity-50"
                              )}
                            >
                              <div className={cn(
                                "w-4 h-4 border-2 rounded flex items-center justify-center flex-shrink-0",
                                isHighlighted 
                                  ? "border-primary bg-primary" 
                                  : canClick 
                                    ? "border border-gray-500" 
                                    : "border-gray-200"
                              )}>
                                {isHighlighted && (
                                  <Check className="w-3 h-3 text-white" />
                                )}
                              </div>
                              <span className={cn(
                                "text-sm font-medium",
                                !canClick && !isHighlighted && "text-gray-400"
                              )}>
                                {amenity.name}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </FormControl>
                <FormDescription>
                  {selectedIds.length} of 3 selected<br />
                  {currentSelectedAmenities.length > 0 
                    ? "Select up to 3 amenities to highlight as featured from your selected amenities above."
                    : "You need to select amenities from the list above first."}
                </FormDescription>
                <FormMessage />
              </FormItem>
            );
          }}
        />
      </div>
    </div>
  );
}