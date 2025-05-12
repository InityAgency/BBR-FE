"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import ImageUpload from "@/components/web/Forms/ImageUpload";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";

const developerOnboardingSchema = z.object({
    // Step 1: Company Information
    address: z.string().min(2, "Company address must be at least 2 characters"),
    phoneNumber: z.string().min(2, "Phone number must be at least 2 characters"),
    website: z.string().url("Please enter a valid website URL").optional().or(z.literal("")),

    // Step 2: Contact Person Information
    contactPersonFullName: z.string().min(2, "Full name must be at least 2 characters").optional(),
    contactPersonJobTitle: z.string().min(2, "Job title must be at least 2 characters").optional(),
    contactPersonEmail: z.string().email("Please enter a valid email address").optional(),
    contactPersonPhoneNumber: z.string().min(2, "Phone number must be at least 2 characters").optional(),

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
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
    const [formSubmitAttempted, setFormSubmitAttempted] = useState(false);

    const form = useForm<DeveloperOnboardingFormValues>({
        resolver: zodResolver(developerOnboardingSchema),
        defaultValues: {
            // Step 1
            address: "",
            phoneNumber: "",
            website: "",

            // Step 2
            contactPersonFullName: "",
            contactPersonJobTitle: "",
            contactPersonEmail: "",
            contactPersonPhoneNumber: "",

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
            await form.trigger(["address", "phoneNumber", "website"]);

            // Check for validation errors in step 1 fields
            const step1Fields = ["address", "phoneNumber", "website"] as const;
            const hasErrors = step1Fields.some(field => !!form.formState.errors[field as keyof typeof form.formState.errors]);

            if (hasErrors) {
                console.error("Validation errors:", form.formState.errors);
                toast.error("Please fix the form errors before continuing");
                setIsLoading(false);
                return;
            }

            // Get current form data
            const data = form.getValues();

            // Upload logo if provided
            let imageId = undefined;
            if (logoFile) {
                try {
                    const uploadResponse = await uploadFile(logoFile, 'COMPANY');
                    console.log("Logo upload response:", uploadResponse);
                    
                    // Pristupamo ID-u iz odgovora servera prema strukturi
                    if (uploadResponse.data && uploadResponse.data.id) {
                        imageId = uploadResponse.data.id;
                    } else {
                        // Fallback za kompatibilnost sa drugim formatima
                        imageId = uploadResponse.id;
                    }
                    
                    console.log("Logo upload successful, imageId:", imageId);
                } catch (uploadError) {
                    console.error("Logo upload failed:", uploadError);
                    toast.error("Failed to upload company logo. Please try again.");
                    setIsLoading(false);
                    return;
                }
            }

            // Submit company info
            const companyData = {
                address: data.address,
                phoneNumber: data.phoneNumber,
                website: data.website || undefined,
                imageId: imageId,
            };

            // Log the data being sent
            console.log("Submitting company data:", companyData);

            const response = await apiRequest('companies/me', 'PUT', companyData);
            console.log("Step 1 submit successful:", response);

            toast.success('Company info saved!');
            setCurrentStep(2);
        } catch (error) {
            console.error('Error in Step 1 submit:', error);
            toast.error('Failed to save company info. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleStep2Submit = async () => {
        setIsLoading(true);

        try {
            // Validate specific fields for this step
            await form.trigger([
                "contactPersonFullName",
                "contactPersonJobTitle",
                "contactPersonEmail",
                "contactPersonPhoneNumber"
            ]);

            // Check for validation errors in step 2 fields
            const step2Fields = [
                "contactPersonFullName",
                "contactPersonJobTitle",
                "contactPersonEmail",
                "contactPersonPhoneNumber"
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

            // Upload profile image if provided
            let imageId = undefined;
            if (profileImageFile) {
                try {
                    const uploadResponse = await uploadFile(profileImageFile, 'USER');
                    console.log("Profile image upload response:", uploadResponse);
                    
                    // Pristupamo ID-u iz odgovora servera prema strukturi
                    if (uploadResponse.data && uploadResponse.data.id) {
                        imageId = uploadResponse.data.id;
                    } else {
                        // Fallback za kompatibilnost sa drugim formatima
                        imageId = uploadResponse.id;
                    }
                    
                    console.log("Profile image upload successful, imageId:", imageId);
                } catch (uploadError) {
                    console.error("Profile image upload failed:", uploadError);
                    toast.error("Failed to upload profile image. Please try again.");
                    setIsLoading(false);
                    return;
                }
            }

            // Submit contact person info with direct field names
            const contactPersonData = {
                contactPersonFullName: data.contactPersonFullName,
                contactPersonJobTitle: data.contactPersonJobTitle,
                contactPersonEmail: data.contactPersonEmail,
                contactPersonPhoneNumber: data.contactPersonPhoneNumber,
                imageId: imageId
            };

            console.log("Submitting contact person data:", contactPersonData);

            const response = await apiRequest('companies/me', 'PUT', contactPersonData);
            console.log("Step 2 submit successful:", response);

            toast.success('Contact information saved!');
            setCurrentStep(3);
        } catch (error) {
            console.error('Error in Step 2 submit:', error);
            toast.error('Failed to save contact information. Please try again.');
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
            router.push('/developer/onboarding/thank-you');
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

    const nextStep = () => {
        setCurrentStep((prev) => Math.min(prev + 1, 3));
    };

    const prevStep = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 1));
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
                                        <Link href="/developer/dashboard" className="text-balance cursor-pointer text-md font-medium text-primary-foreground flex items-center gap-1 hover:text-primary transition-all mb-3">
                                            Skip and start
                                            <ArrowRight size={20} />
                                        </Link>
                                        <span className="text-muted-foreground text-md font-medium">Developer account</span>
                                    </div>
                                    <h1 className="text-3xl font-bold text-left">Set up your Company information</h1>
                                    <p className="text-muted-foreground mt-2">
                                        Provide your company details to create a compelling profile for your branded residence. This will help us feature your property to an exclusive audience of discerning buyers
                                    </p>
                                </div>
                                <div className="space-y-6">
                                    <ImageUpload onFileChange={setLogoFile} title="Upload your company logo" />
                                    <FormField
                                        control={form.control}
                                        name="address"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Company Address</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Enter company address" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="phoneNumber"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Corporate Phone Number</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Enter phone number" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="website"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Company Website (Optional)</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="https://your-company.com" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </>
                        )}

                        {currentStep === 2 && (
                            <>
                                <div>
                                    <div className="flex w-full flex-row items-center justify-between">
                                        <Link href="/developer/dashboard" className="text-balance cursor-pointer text-md font-medium text-primary-foreground flex items-center gap-1 hover:text-primary transition-all mb-3">
                                            Skip and start
                                            <ArrowRight size={20} />
                                        </Link>
                                        <span className="text-muted-foreground text-md font-medium">Developer account</span>
                                    </div>
                                    <h1 className="text-3xl font-bold text-left">Setup your user information</h1>
                                    <p className="text-muted-foreground mt-2">
                                        Provide your company details to create a compelling profile for your branded residence. This will help us feature your property to an exclusive audience of discerning buyers
                                    </p>
                                </div>

                                <div className="space-y-6">
                                    <ImageUpload onFileChange={setProfileImageFile}  title="Upload your avatar "/>
                                    <FormField
                                        control={form.control}
                                        name="contactPersonFullName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Full name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Enter your full name" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="contactPersonJobTitle"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Job title</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Enter your job title" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="contactPersonEmail"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email address</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Enter your email address" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="contactPersonPhoneNumber"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Phone number</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Enter your phone number" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </>
                        )}

                        {currentStep === 3 && (
                            <>
                                <div>
                                    <div className="flex w-full flex-row items-center justify-between">
                                        <Link href="/developer/dashboard" className="text-balance cursor-pointer text-md font-medium text-primary-foreground flex items-center gap-1 hover:text-primary transition-all mb-3">
                                            Skip and start
                                            <ArrowRight size={20} />
                                        </Link>
                                        <span className="text-muted-foreground text-md font-medium">Developer account</span>
                                    </div>
                                    <h1 className="text-3xl font-bold text-left">Enhance Your Visibility and Attract High-Value Buyers</h1>
                                    <p className="text-muted-foreground mt-2">
                                        Provide your company details to create a compelling profile for your branded residence. This will help us feature your property to an exclusive audience of discerning buyers
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