"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { ChevronRight, ChevronLeft, Check } from "lucide-react";

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

// Custom Components - ove ćete morati da importujete iz vaših postojećih komponenti
import LocationSelector from "@/components/web/Forms/LocationSelector";
import MultipleImageUpload from "@/components/web/Forms/MultipleImageUpload";
import { CountryAndCity } from "@/components/web/Forms/CountryAndCity";
import {MultiSelect} from "@/components/web/Forms/MultiSelect";

// Constants and schemas - importujte iz vašeg postojećeg koda
import { API_BASE_URL, API_VERSION } from "@/app/constants/api";
import { 
  residenceSchema,
  ResidenceFormValues,
  initialResidenceValues,
  DevelopmentStatus,
  RentalPotential 
} from "@/app/schemas/residence";

// Step definitions
const STEPS = [
  { id: 1, name: "General information", description: "Basic details about the residence" },
  { id: 2, name: "Key Features", description: "Features and development information" },
  { id: 3, name: "Visuals", description: "Gallery and video tour" },
  { id: 4, name: "Amenities", description: "Available amenities and highlights" },
] as const;

// Schema za svaki korak
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

const step3Schema = z.object({
  videoTourUrl: z.string().url().optional().or(z.literal("")),
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

export default function MultiStepResidenceForm() {
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
  
  // Form setup
  const form = useForm<ResidenceFormValues>({
    resolver: zodResolver(residenceSchema),
    defaultValues: {
      ...initialResidenceValues,
      latitude: "0",
      longitude: "0",
    },
    mode: "onChange",
  });

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
        status: "PENDING", // Always PENDING for web creation
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

  // Update residence (Steps 2-4)
  const updateResidence = async () => {
    if (!residenceId) return;

    try {
      setIsSubmitting(true);
      const values = form.getValues();
      let dataToSend: any = {};

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
          // Upload images first
          const uploadedImages = await uploadImages();
          dataToSend = {
            mainGallery: uploadedImages.map((img, index) => ({
              id: img.mediaId,
              order: index,
            })),
            featuredImageId: featuredImage?.mediaId || uploadedImages[0]?.mediaId || null,
            videoTourUrl: values.videoTourUrl || null,
          };
          break;
        case 4:
          dataToSend = {
            amenities: values.amenities?.map(a => a.id) || [],
            highlightedAmenities: values.highlightedAmenities || [],
          };
          break;
      }

      const response = await fetch(
        `${API_BASE_URL}/api/${API_VERSION}/residences/${residenceId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(dataToSend),
        }
      );

      if (!response.ok) throw new Error('Failed to update residence');

      toast.success('Progress saved');
    } catch (error) {
      toast.error('Failed to save progress');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Upload images helper
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
            isFeatured: image.isFeatured,
          });
        }
      }
    }
    
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
    toast.success("Residence submitted for review!");
    router.push("/");
  };

  // Render step indicator
  const renderStepIndicator = () => (
    <div className="w-full mb-8">
      <Tabs value={currentStep.toString()} className="w-full">
        <TabsList className="grid w-full grid-cols-4 h-auto p-1">
          {STEPS.map((step) => (
            <TabsTrigger
              key={step.id}
              value={step.id.toString()}
              disabled={!residenceId && step.id > 1}
              className={`
                data-[state=active]:bg-primary data-[state=active]:text-primary-foreground
                ${step.id < currentStep ? 'text-primary' : ''}
                ${step.id > currentStep && (!residenceId || step.id > 1) ? 'text-muted-foreground' : ''}
                py-3 px-4
              `}
              onClick={() => {
                if (residenceId || step.id === 1) {
                  if (step.id < currentStep) {
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
        return <Step3Content form={form} images={images} setImages={setImages} featuredImage={featuredImage} setFeaturedImage={setFeaturedImage} />;
      case 4:
        return <Step4Content form={form} amenities={amenities} />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Add new residence</h1>
        <p className="text-muted-foreground">
          Create a new residence listing by following the steps below
        </p>
      </div>

      {renderStepIndicator()}

      <Form {...form}>
        <form className="space-y-8">
          <Card>
            <CardContent className="pt-6">
              {renderStepContent()}
            </CardContent>
          </Card>

          <div className="flex justify-between items-center">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1 || isSubmitting}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/")}
              >
                Save & Exit
              </Button>

              {currentStep < STEPS.length ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={isSubmitting}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handlePublish}
                  disabled={isSubmitting}
                  className="bg-primary"
                >
                  Publish residence
                </Button>
              )}
            </div>
          </div>
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
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Basic information</h2>
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
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a brand" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {brands.map((brand) => (
                      <SelectItem key={brand.id} value={brand.id}>
                        {brand.name}
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
        <h2 className="text-xl font-semibold mb-4">Brief Overview</h2>
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
        <h2 className="text-xl font-semibold mb-4">Budget Limitations</h2>
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

      <div>
        <h2 className="text-xl font-semibold mb-4">Location Details</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="countryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country <span className="text-destructive">*</span></FormLabel>
                  <CountryAndCity
                    defaultCountryId={field.value}
                    defaultCityId={form.watch("cityId")}
                    onCountrySelect={(countryId) => {
                      field.onChange(countryId);
                      form.setValue("cityId", "", { shouldValidate: true });
                    }}
                    onCitySelect={(cityId) => {
                      form.setValue("cityId", cityId, { shouldValidate: true });
                    }}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cityId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City <span className="text-destructive">*</span></FormLabel>
                  <FormMessage />
                </FormItem>
              )}
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
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Key Features</h2>
        <p className="text-muted-foreground mb-4">
          CHOOSE 5 KEY FEATURES TO REPRESENT YOUR PROPERTY
        </p>
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
        <h2 className="text-xl font-semibold mb-4">Development Information</h2>
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
              <FormItem>
                <FormLabel>Development status <span className="text-destructive">*</span></FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
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
              <FormItem className="col-span-2">
                <FormLabel>Rental potential</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
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
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Policies</h2>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="petFriendly"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
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
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
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
}

function Step3Content({ form, images, setImages, featuredImage, setFeaturedImage }: Step3ContentProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Main Gallery</h2>
        <p className="text-muted-foreground mb-6">Maximum 10 photos</p>
        
        <MultipleImageUpload
          onChange={setImages}
          onFeaturedChange={setFeaturedImage}
          maxImages={10}
          maxSizePerImage={5}
        />
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Video Tour</h2>
        <FormField
          control={form.control}
          name="videoTourUrl"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input 
                  placeholder="Enter Youtube video URL" 
                  value={field.value || ""}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                />
              </FormControl>
              <FormDescription>
                OR
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}

// Step 4 Component
interface Step4ContentProps {
  form: ReturnType<typeof useForm<ResidenceFormValues>>;
  amenities: Amenity[];
}

function Step4Content({ form, amenities }: Step4ContentProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Provide the full list of amenities nearby</h2>
        
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

      <div>
        <h2 className="text-xl font-semibold mb-4">Highlight top 3 amenities</h2>
        
        <FormField
          control={form.control}
          name="highlightedAmenities"
          render={({ field }) => {
            const selectedAmenities = form.watch("amenities") || [];
            const highlightedAmenities = field.value || [];

            // Prepare options for MultiSelect
            const amenityOptions = selectedAmenities.map(amenity => ({
              id: amenity.id,
              name: amenity.name
            }));

            // Extract just the IDs for the value prop
            const selectedIds = highlightedAmenities.map(h => h.id);

            const handleSelectionChange = (selectedIds: string[]) => {
              const newHighlightedAmenities = selectedIds.map((id, index) => ({
                id: id,
                order: index
              }));

              field.onChange(newHighlightedAmenities);
            };

            return (
              <FormItem>
                <FormLabel>Featured amenities (max 3) <span className="text-destructive">*</span></FormLabel>
                <FormControl>
                  <MultiSelect
                    value={selectedIds}
                    onChange={handleSelectionChange}
                    placeholder="Select amenities to highlight"
                    apiEndpoint="amenities"
                    maxItems={3}
                    initialOptions={amenityOptions}
                  />
                </FormControl>
                <FormDescription>
                  {selectedIds.length} of 3 selected<br />
                  Select up to 3 amenities to highlight as featured. These will be displayed prominently.
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