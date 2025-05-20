"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { Mail, Phone, Briefcase } from "lucide-react";
import ImageUpload from "@/components/web/Forms/ImageUpload";

const developerInformationSchema = z.object({
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    contactPersonFullName: z.string().min(2, "Contact person name must be at least 2 characters"),
    contactPersonJobTitle: z.string().min(2, "Job title must be at least 2 characters"),
    contactPersonEmail: z.string().email("Please enter a valid contact email address"),
    contactPersonPhoneNumber: z.string().min(5, "Phone number must be at least 5 characters"),
    contactPersonPhoneNumberCountryCode: z.string().min(2, "Country code is required"),
});

type DeveloperInformationFormValues = z.infer<typeof developerInformationSchema>;

export default function PersonalInformationDeveloper() {
    const [isLoading, setIsLoading] = useState(false);
    const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
    const [initialData, setInitialData] = useState<any>(null);
    const [existingAvatar, setExistingAvatar] = useState<string | null>(null);
    const [existingAvatarId, setExistingAvatarId] = useState<string | null>(null);

    const form = useForm<DeveloperInformationFormValues>({
        resolver: zodResolver(developerInformationSchema),
        defaultValues: {
            fullName: "",
            email: "",
            contactPersonFullName: "",
            contactPersonJobTitle: "",
            contactPersonEmail: "",
            contactPersonPhoneNumber: "",
            contactPersonPhoneNumberCountryCode: "+381",
        },
    });

    // Helper function for API requests
    const apiRequest = async (endpoint: string, method: string, data?: any) => {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL;
        const apiVersion = process.env.NEXT_PUBLIC_API_VERSION;

        console.log(`Making ${method} request to ${endpoint} with data:`, data);

        const response = await fetch(`${baseUrl}/api/${apiVersion}/${endpoint}`, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: data ? JSON.stringify(data) : undefined,
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

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await apiRequest('auth/me', 'GET');
                const user = response.data;
                const company = user.company || {};
                
                setInitialData(user);

                // Reset form with user and company data
                form.reset({
                    fullName: user.fullName || "",
                    email: user.email || "",
                    contactPersonFullName: company.contactPersonFullName || "",
                    contactPersonJobTitle: company.contactPersonJobTitle || "",
                    contactPersonEmail: company.contactPersonEmail || "",
                    contactPersonPhoneNumber: company.contactPersonPhoneNumber || "",
                    contactPersonPhoneNumberCountryCode: company.contactPersonPhoneNumberCountryCode || "+381",
                });

                // Set existing avatar if available
                if (company.contactPersonAvatar && company.contactPersonAvatar.id) {
                    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
                    const apiVersion = process.env.NEXT_PUBLIC_API_VERSION;
                    setExistingAvatar(`${baseUrl}/api/${apiVersion}/media/${company.contactPersonAvatar.id}`);
                    setExistingAvatarId(company.contactPersonAvatar.id);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                toast.error('Failed to load user data');
            }
        };

        fetchUserData();
    }, [form]);

    const onSubmit = async (data: DeveloperInformationFormValues) => {
        setIsLoading(true);

        try {
            // Upload profile image if provided
            let imageId = existingAvatarId; // Zadržavamo postojeći ID ako nismo promenili sliku
            
            if (profileImageFile) {
                try {
                    const uploadResponse = await uploadFile(profileImageFile, 'USER');
                    console.log("Upload response:", uploadResponse);
                    
                    if (uploadResponse.data && uploadResponse.data.id) {
                        imageId = uploadResponse.data.id;
                    } else if (uploadResponse.id) {
                        imageId = uploadResponse.id;
                    }
                } catch (uploadError) {
                    console.error("Profile image upload failed:", uploadError);
                    toast.error("Failed to upload profile image");
                    setIsLoading(false);
                    return;
                }
            }

            // Prepare company contact person data
            const companyData = {
                contactPersonFullName: data.contactPersonFullName,
                contactPersonJobTitle: data.contactPersonJobTitle,
                contactPersonEmail: data.contactPersonEmail,
                contactPersonPhoneNumber: data.contactPersonPhoneNumber,
                contactPersonPhoneNumberCountryCode: data.contactPersonPhoneNumberCountryCode,
            };
            
            // Add contactPersonAvatarId ako imamo sliku
            if (imageId) {
                (companyData as any).contactPersonAvatarId = imageId;
            } else if (profileImageFile === null && existingAvatar === null) {
                // Ako je korisnik uklonio avatar, postavi na null
                (companyData as any).contactPersonAvatarId = null;
            }

            // Prepare user data - samo fullName
            const userData = {
                fullName: data.fullName,
            };

            // Update user data 
            await apiRequest('users/me', 'PUT', userData);
            
            // Update company data
            await apiRequest('companies/me', 'PUT', companyData);

            // Update existing avatar in UI if new image was uploaded
            if (imageId && imageId !== existingAvatarId) {
                const baseUrl = process.env.NEXT_PUBLIC_API_URL;
                const apiVersion = process.env.NEXT_PUBLIC_API_VERSION;
                setExistingAvatar(`${baseUrl}/api/${apiVersion}/media/${imageId}`);
                setExistingAvatarId(imageId);
            }

            toast.success('Profile updated successfully');
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Failed to update profile');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemoveAvatar = () => {
        setExistingAvatar(null);
        setProfileImageFile(null);
        setExistingAvatarId(null);
    };

    return (
        <div className="space-y-6 w-full py-8 xl:max-w-2xl custom-form">
            <div>
                <h1 className="text-2xl text-sans font-bold text-left">Personal Information</h1>
                <p className="text-muted-foreground mt-2">
                    Update your personal information and company contact details.
                </p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Developer Personal Information Section */}
                    <div className="border-b pb-6">
                        <h2 className="text-xl font-semibold mb-4 text-sans">Your Information</h2>
                        
                        <FormField
                            control={form.control}
                            name="fullName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Full Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your full name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem className="mt-4">
                                    <FormLabel>Email Address</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your email" {...field} disabled />
                                    </FormControl>
                                    <FormMessage />
                                    <span className="text-muted-foreground text-sm mt-0">
                                        For changing your email address, please contact support.
                                    </span>
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Contact Person Section */}
                    <div>
                        <h2 className="text-xl font-semibold mb-4 text-sans">Contact Person Information</h2>
                        
                        <div className="space-y-4 mb-6">
                            <ImageUpload
                                onFileChange={setProfileImageFile}
                                title={existingAvatar ? "Change contact person avatar" : "Upload contact person avatar"}
                                preview={existingAvatar ? `${existingAvatar}/content` : undefined}
                                onRemove={handleRemoveAvatar}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="contactPersonFullName"
                            render={({ field }) => (
                                <FormItem className="mt-4">
                                    <FormLabel>Contact Person Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter contact person's full name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="contactPersonJobTitle"
                            render={({ field }) => (
                                <FormItem className="mt-4">
                                    <FormLabel>Job Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter job title" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="contactPersonEmail"
                            render={({ field }) => (
                                <FormItem className="mt-4">
                                    <FormLabel>Contact Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter contact email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                            <FormField
                                control={form.control}
                                name="contactPersonPhoneNumberCountryCode"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Country Code</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter country code" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="md:col-span-2">
                                <FormField
                                    control={form.control}
                                    name="contactPersonPhoneNumber"
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
                            </div>
                        </div>
                    </div>

                    <Button type="submit" className="w-full mt-6" disabled={isLoading}>
                        {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                </form>
            </Form>
        </div>
    );
}