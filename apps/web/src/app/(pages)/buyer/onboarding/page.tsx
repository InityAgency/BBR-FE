"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { ArrowRight, Mail, Phone } from "lucide-react";
import ImageUpload from "@/components/web/Forms/ImageUpload";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { CountrySelect } from "@/components/web/Forms/CountrySelect";
import { MultiSelect } from "@/components/web/Forms/MultiSelect";

// Ažurirana schema za sve korake uključujući step 2
const developerOnboardingSchema = z.object({
    // Step 1: Profile Information
    currentLocation: z.string().min(2, "Current location must be at least 2 characters"),
    phoneNumber: z.string().min(2, "Phone number must be at least 2 characters"),
    preferredContactMethod: z.string().min(1, "Please select a preferred contact method"),
    website: z.string().url("Please enter a valid website URL").optional().or(z.literal("")),

    // Step 2: Preferences
    unitTypes: z.array(z.string()).min(1, "Please select at least one unit type"),
    preferredResidenceLocation: z.string().min(2, "Preferred location must be at least 2 characters"),
    lifestyles: z.array(z.string()).min(1, "Please select at least one lifestyle preference"),
    budgetRangeFrom: z.string().refine((val) => !isNaN(Number(val)), {
        message: "Budget must be a number",
    }),
    budgetRangeTo: z.string().refine((val) => !isNaN(Number(val)), {
        message: "Budget must be a number",
    }),

    // Step 3: Notification Preferences
    notifyLatestNews: z.boolean().default(false),
    notifyMarketTrends: z.boolean().default(false),
    notifyBlogs: z.boolean().default(false),
    receiveLuxuryInsights: z.boolean().default(false),
    pushNotifications: z.boolean().default(false),
    emailNotifications: z.boolean().default(false)
});

type DeveloperOnboardingFormValues = z.infer<typeof developerOnboardingSchema>;

export default function DeveloperOnboarding() {
    const { user } = useAuth();
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
    const [formSubmitAttempted, setFormSubmitAttempted] = useState(false);

    const form = useForm<DeveloperOnboardingFormValues>({
        resolver: zodResolver(developerOnboardingSchema),
        defaultValues: {
            // Step 1
            currentLocation: "",
            phoneNumber: "",
            website: "",
            preferredContactMethod: "",

            // Step 2
            unitTypes: [],
            preferredResidenceLocation: "",
            lifestyles: [],
            budgetRangeFrom: "",
            budgetRangeTo: "",

            // Step 3
            notifyLatestNews: false,
            notifyMarketTrends: false,
            notifyBlogs: false,
            receiveLuxuryInsights: false,
            pushNotifications: false,
            emailNotifications: false
        },
        mode: "onChange" // Enable real-time validation
    });

    // Helper function for API requests
    const apiRequest = async (endpoint: string, method: string, data: any) => {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL;
        const apiVersion = process.env.NEXT_PUBLIC_API_VERSION;

        const response = await fetch(`${baseUrl}/api/${apiVersion}/${endpoint}`, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // Important for sending cookies/session
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('API Error Response:', errorText);
            throw new Error(`API request failed with status ${response.status}: ${errorText}`);
        }

        return await response.json();
    };

    // Helper function for file upload
    const uploadFile = async (file: File, type: 'COMPANY' | 'USER') => {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL;
        const apiVersion = process.env.NEXT_PUBLIC_API_VERSION;

        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch(`${baseUrl}/api/${apiVersion}/media?type=${type}`, {
            method: "POST",
            credentials: 'include',
            body: formData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Upload Error Response:', errorText);
            throw new Error(`Upload failed with status ${response.status}: ${errorText}`);
        }

        return await response.json();
    };

    const handleStep1Submit = async () => {
        setFormSubmitAttempted(true);
        setIsLoading(true);

        try {
            // Validate specific fields for this step
            await form.trigger(["currentLocation", "phoneNumber", "preferredContactMethod"]);

            // Check for validation errors in step 1 fields
            const step1Fields = ["currentLocation", "phoneNumber", "preferredContactMethod"] as const;
            const hasErrors = step1Fields.some(field => !!form.formState.errors[field as keyof typeof form.formState.errors]);

            if (hasErrors) {
                console.error("Validation errors:", form.formState.errors);
                toast.error("Please fix the form errors before continuing");
                setIsLoading(false);
                return;
            }

            // Get current form data
            const data = form.getValues();

            // Upload profile image if provided
            let imageId = undefined;
            if (profileImageFile) {
                try {
                    const uploadResponse = await uploadFile(profileImageFile, 'USER');
                    imageId = uploadResponse?.id;
                    console.log("Profile image upload successful, imageId:", imageId);
                } catch (uploadError) {
                    console.error("Profile image upload failed:", uploadError);
                    toast.error("Failed to upload profile image. Please try again.");
                    setIsLoading(false);
                    return;
                }
            }

            // Submit buyer profile info
            const buyerData = {
                currentLocation: data.currentLocation,
                phoneNumber: data.phoneNumber,
                preferredContactMethod: data.preferredContactMethod,
                imageId: imageId,
            };

            console.log("Submitting buyer data:", buyerData);

            const response = await apiRequest('users/me', 'PUT', buyerData);
            console.log("Step 1 submit successful:", response);

            toast.success('Profile info saved!');
            setCurrentStep(2);
        } catch (error) {
            console.error('Error in Step 1 submit:', error);
            toast.error('Failed to save profile info. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleStep2Submit = async () => {
        setIsLoading(true);

        try {
            // Validate specific fields for this step
            await form.trigger([
                "unitTypes",
                "preferredResidenceLocation",
                "lifestyles",
                "budgetRangeFrom",
                "budgetRangeTo"
            ]);

            // Check for validation errors in step 2 fields
            const step2Fields = [
                "unitTypes",
                "preferredResidenceLocation",
                "lifestyles",
                "budgetRangeFrom",
                "budgetRangeTo"
            ];
            const hasErrors = step2Fields.some(field => {
                const error = form.formState.errors[field as keyof typeof form.formState.errors];
                return !!error;
            });

            if (hasErrors) {
                console.error("Validation errors:", form.formState.errors);
                toast.error("Please fix the form errors before continuing");
                setIsLoading(false);
                return;
            }

            // Get current form data
            const data = form.getValues();

            // Submit preferences data
            const preferencesData = {
                unitTypes: data.unitTypes,
                preferredResidenceLocation: data.preferredResidenceLocation,
                lifestyles: data.lifestyles,
                budgetRangeFrom: Number(data.budgetRangeFrom),
                budgetRangeTo: Number(data.budgetRangeTo)
            };

            console.log("Submitting preferences data:", preferencesData);

            const response = await apiRequest('users/me', 'PUT', preferencesData);
            console.log("Step 2 submit successful:", response);

            toast.success('Preferences saved!');
            setCurrentStep(3);
        } catch (error) {
            console.error('Error in Step 2 submit:', error);
            toast.error('Failed to save preferences. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const finalSubmit = async () => {
        setIsLoading(true);

        try {
            // Get all form data
            const data = form.getValues();

            // Prepare notification preferences data
            const notificationPreferences = {
                notifyLatestNews: data.notifyLatestNews,
                notifyMarketTrends: data.notifyMarketTrends,
                notifyBlogs: data.notifyBlogs,
                receiveLuxuryInsights: data.receiveLuxuryInsights,
                pushNotifications: data.pushNotifications,
                emailNotifications: data.emailNotifications
            };

            console.log("Submitting notification preferences:", notificationPreferences);

            // Send notification preferences to users/me endpoint
            const response = await apiRequest('users/me', 'PUT', notificationPreferences);
            console.log("Notification preferences update successful:", response);

            toast.success('Onboarding completed successfully!');
            router.push('/buyer/onboarding/thank-you');
        } catch (error) {
            console.error('Error in final onboarding submit:', error);
            toast.error('Failed to complete onboarding. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (currentStep === 1) {
            await handleStep1Submit();
        } else if (currentStep === 2) {
            await handleStep2Submit();
        } else {
            await finalSubmit();
        }
    };

    return (
        <div className="">
            <div className="space-y-6">
                <Form {...form}>
                    <form onSubmit={handleSubmit} className="space-y-6 onboarding-form">
                        {currentStep === 1 && (
                            <>
                                <div>
                                    <div className="flex w-full flex-row items-center justify-between">
                                        <Link href="/buyer/dashboard" className="text-balance cursor-pointer text-md font-medium text-primary-foreground flex items-center gap-1 hover:text-primary transition-all mb-3">
                                            Skip and start
                                            <ArrowRight size={20} />
                                        </Link>
                                        <span className="text-muted-foreground text-md font-medium">Buyer account</span>
                                    </div>
                                    <h1 className="text-3xl font-bold text-left">Let us update your unique experience</h1>
                                    <p className="text-muted-foreground mt-2">
                                        Please let us know a bit more about yourself so we can personalize your account and optimize your search results.
                                    </p>
                                </div>
                                <div className="space-y-6">
                                    <ImageUpload onFileChange={setProfileImageFile} title="Upload your an avatar" />
                                    
                                    <FormField
                                        control={form.control}
                                        name="currentLocation"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Current Location</FormLabel>
                                                <FormControl>
                                                    <CountrySelect
                                                        value={field.value}
                                                        onChange={field.onChange}
                                                        placeholder="Select location"
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="phoneNumber"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Phone Number</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Enter phone number" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="flex flex-col gap-4">
                                        <FormLabel>Preferred contact method</FormLabel>
                                        <FormField
                                            control={form.control}
                                            name="preferredContactMethod"
                                            render={({ field }) => (
                                                <FormItem className="space-y-0">
                                                    <div className="flex flex-col lg:flex-row gap-2">
                                                        {[
                                                            { value: "EMAIL", label: "Email" },
                                                            { value: "PHONE", label: "Phone" },
                                                            { value: "WHATSAPP", label: "WhatsApp" },
                                                        ].map((method) => (
                                                            <div
                                                                key={method.value}
                                                                className={`flex items-center space-x-3 rounded-md border px-3 py-3 cursor-pointer transition-colors w-full ${
                                                                    field.value === method.value
                                                                        ? "border-primary bg-primary/10"
                                                                        : "border-muted"
                                                                }`}
                                                                onClick={() => {
                                                                    field.onChange(method.value);
                                                                }}
                                                            >
                                                                <div className="space-y-1 leading-none">
                                                                    <FormLabel className="cursor-pointer">
                                                                        {method.value === "EMAIL" && (
                                                                            <Mail color="#6B7280" className="w-5 h-5" />
                                                                        )}
                                                                        {method.value === "PHONE" && (
                                                                            <Phone color="#6B7280" className="w-5 h-5" />
                                                                        )}
                                                                        {method.value === "WHATSAPP" && (
                                                                            <Image
                                                                                src="/whatsapp.svg"
                                                                                alt="WhatsApp"
                                                                                width={20}
                                                                                height={20}
                                                                            />
                                                                        )}
                                                                        {method.label}
                                                                    </FormLabel>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        {currentStep === 2 && (
                            <>
                                <div>
                                    <div className="flex w-full flex-row items-center justify-between">
                                        <Link href="/buyer/dashboard" className="text-balance cursor-pointer text-md font-medium text-primary-foreground flex items-center gap-1 hover:text-primary transition-all mb-3">
                                            Skip and start
                                            <ArrowRight size={20} />
                                        </Link>
                                        <span className="text-muted-foreground text-md font-medium">Buyer account</span>
                                    </div>
                                    <h1 className="text-3xl font-bold text-left">Let us update your unique experience</h1>
                                    <p className="text-muted-foreground mt-2">
                                        Please let us know a bit more about yourself so we can personalize your account and optimize your search results.
                                    </p>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-xl font-medium text-sans">Share with us what house you prefer</h3>
                                        <p className="text-muted-foreground">
                                            Please choose your preferences. For the best results, add 3-5 preferences in each section.
                                        </p>
                                    </div>
                                    <div className="border-b border-border"></div>

                                    {/* Unit Types Selection */}
                                    <FormField
                                        control={form.control}
                                        name="unitTypes"
                                        render={({ field }) => (
                                            <MultiSelect
                                                value={field.value}
                                                onChange={field.onChange}
                                                label="Preferred Unit Types"
                                                placeholder="Select unit types"
                                                apiEndpoint="unit-types"
                                                required={true}
                                                error={form.formState.errors.unitTypes?.message?.toString()}
                                            />
                                        )}
                                    />

                                    {/* Preferred Location */}
                                    <FormField
                                        control={form.control}
                                        name="preferredResidenceLocation"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Preferred Residence Location</FormLabel>
                                                <FormControl>
                                                    <CountrySelect
                                                        value={field.value}
                                                        onChange={field.onChange}
                                                        placeholder="Preferred Residence Location"
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />

                                    {/* Lifestyle Preferences */}
                                    <FormField
                                        control={form.control}
                                        name="lifestyles"
                                        render={({ field }) => (
                                            <MultiSelect
                                                value={field.value}
                                                onChange={field.onChange}
                                                label="Lifestyle Preferences"
                                                placeholder="Select lifestyle preferences"
                                                apiEndpoint="lifestyles"
                                                required={true}
                                                error={form.formState.errors.lifestyles?.message?.toString()}
                                            />
                                        )}
                                    />

                                    {/* Budget Range */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="budgetRangeFrom"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Budget Range (From)</FormLabel>
                                                    <FormControl>
                                                        <Input 
                                                            type="number" 
                                                            placeholder="Minimum budget" 
                                                            {...field} 
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="budgetRangeTo"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Budget Range (To)</FormLabel>
                                                    <FormControl>
                                                        <Input 
                                                            type="number" 
                                                            placeholder="Maximum budget" 
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        {currentStep === 3 && (
                            <>
                                <div>
                                    <div className="flex w-full flex-row items-center justify-between">
                                        <Link href="/buyer/dashboard" className="text-balance cursor-pointer text-md font-medium text-primary-foreground flex items-center gap-1 hover:text-primary transition-all mb-3">
                                            Skip and start
                                            <ArrowRight size={20} />
                                        </Link>
                                        <span className="text-muted-foreground text-md font-medium">Buyer account</span>
                                    </div>
                                    <h1 className="text-3xl font-bold text-left">Let us update your unique experience</h1>
                                    <p className="text-muted-foreground mt-2">
                                        Please let us know a bit more about yourself so we can personalize your account and optimize your search results.
                                    </p>
                                </div>
                                <div className="space-y-3">
                                    <h3 className="text-xl font-medium text-sans">Inform us how we can notify you comfortably</h3>
                                    <div className="border-b border-border"></div>
                                    <h4 className="text-lg font-medium text-sans">What you would like to be notified about</h4>
                                    <div className="flex flex-col gap-2">
                                        <FormField
                                            control={form.control}
                                            name="notifyLatestNews"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={field.value}
                                                            onCheckedChange={field.onChange}
                                                        />
                                                    </FormControl>
                                                    <FormLabel className="font-normal cursor-pointer">
                                                        Latest news
                                                    </FormLabel>
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="notifyMarketTrends"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={field.value}
                                                            onCheckedChange={field.onChange}
                                                        />
                                                    </FormControl>
                                                    <FormLabel className="font-normal cursor-pointer">
                                                        Market trends
                                                    </FormLabel>
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="notifyBlogs"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={field.value}
                                                            onCheckedChange={field.onChange}
                                                        />
                                                    </FormControl>
                                                    <FormLabel className="font-normal cursor-pointer">
                                                        Blogs related to Branded Residences
                                                    </FormLabel>
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="receiveLuxuryInsights"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={field.value}
                                                            onCheckedChange={field.onChange}
                                                        />
                                                    </FormControl>
                                                    <FormLabel className="font-normal cursor-pointer">
                                                        Luxury insights and updates
                                                    </FormLabel>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="border-b border-border"></div>
                                    <h4 className="text-lg font-medium text-sans">How you would like to be notified?</h4>
                                    <FormField
                                        control={form.control}
                                        name="pushNotifications"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-start justify-between gap-3">
                                                <FormControl>
                                                    <Switch
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                    />
                                                </FormControl>
                                                <div className="space-y-0.5 w-full">
                                                    <FormLabel className="text-base cursor-pointer">Push notifications</FormLabel>
                                                    <FormDescription>
                                                        Get alerts in your browser, even when BBR tab is closed.
                                                    </FormDescription>
                                                </div>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="emailNotifications"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-start justify-between gap-3">
                                                <FormControl>
                                                    <Switch
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                    />
                                                </FormControl>
                                                <div className="space-y-0.5 w-full">
                                                    <FormLabel className="text-base cursor-pointer">Email notification</FormLabel>
                                                    <FormDescription>
                                                        Receive an email about each update as soon as it appears.
                                                    </FormDescription>
                                                </div>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </>
                        )}

                        <div className="flex justify-between pt-4">
                            {currentStep < 3 ? (
                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Saving..." : "Continue"}
                                </Button>
                            ) : (
                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Completing..." : "Complete Onboarding"}
                                </Button>
                            )}
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
}