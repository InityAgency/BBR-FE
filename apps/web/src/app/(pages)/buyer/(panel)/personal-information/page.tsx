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
import { Mail, Phone } from "lucide-react";
import ImageUpload from "@/components/web/Forms/ImageUpload";

const personalInformationSchema = z.object({
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    phoneNumber: z.string().min(2, "Phone number must be at least 2 characters"),
    preferredContactMethod: z.string().min(1, "Please select a preferred contact method"),
});

type PersonalInformationFormValues = z.infer<typeof personalInformationSchema>;

export default function PersonalInformation() {
    const [isLoading, setIsLoading] = useState(false);
    const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
    const [initialData, setInitialData] = useState<any>(null);
    const [existingAvatar, setExistingAvatar] = useState<string | null>(null);

    const form = useForm<PersonalInformationFormValues>({
        resolver: zodResolver(personalInformationSchema),
        defaultValues: {
            fullName: "",
            email: "",
            phoneNumber: "",
            preferredContactMethod: "",
        },
    });

    // Helper function for API requests
    const apiRequest = async (endpoint: string, method: string, data?: any) => {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL;
        const apiVersion = process.env.NEXT_PUBLIC_API_VERSION;

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
                setInitialData(user);

                form.reset({
                    fullName: user.fullName || "",
                    email: user.email || "",
                    phoneNumber: user.buyer?.phoneNumber || "",
                    preferredContactMethod: user.buyer?.preferredContactMethod || "",
                });

                // Set existing avatar if available
                if (user.buyer?.image_id) {
                    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
                    const apiVersion = process.env.NEXT_PUBLIC_API_VERSION;
                    setExistingAvatar(`${baseUrl}/api/${apiVersion}/media/${user.buyer.image_id}`);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                toast.error('Failed to load user data');
            }
        };

        fetchUserData();
    }, []);

    const onSubmit = async (data: PersonalInformationFormValues) => {
        setIsLoading(true);

        try {
            // Upload profile image if provided
            let imageId = undefined;
            if (profileImageFile) {
                try {
                    const uploadResponse = await uploadFile(profileImageFile, 'USER');
                    if (uploadResponse.data && uploadResponse.data.id) {
                        imageId = uploadResponse.data.id;
                    }
                } catch (uploadError) {
                    console.error("Profile image upload failed:", uploadError);
                    toast.error("Failed to upload profile image");
                    setIsLoading(false);
                    return;
                }
            }

            // Prepare update data (bez email-a)
            const { email, ...rest } = data;
            const updateData = {
                ...rest,
                imageId: imageId,
            };

            // Update user data (PUT to users/me)
            const response = await apiRequest('users/me', 'PUT', updateData);

            // Update existing avatar if new image was uploaded
            if (imageId) {
                const baseUrl = process.env.NEXT_PUBLIC_API_URL;
                const apiVersion = process.env.NEXT_PUBLIC_API_VERSION;
                setExistingAvatar(`${baseUrl}/api/${apiVersion}/media/${imageId}`);
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
    };

    return (
        <div className="space-y-6 w-full py-8 xl:max-w-2xl custom-form">
            <div>
                <h1 className="text-2xl text-sans font-bold text-left">Personal Information</h1>
                <p className="text-muted-foreground mt-2">
                    Update your personal information and preferences.
                </p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-4">
                        <ImageUpload
                            onFileChange={setProfileImageFile}
                            title={existingAvatar ? "Change your avatar" : "Upload your avatar"}
                            preview={existingAvatar ? `${existingAvatar}/content` : undefined}
                            onRemove={handleRemoveAvatar}
                        />
                    </div>

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
                            <FormItem>
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
                                                className={`flex items-center space-x-3 rounded-md border px-3 py-3 cursor-pointer transition-colors w-full ${field.value === method.value
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

                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                </form>
            </Form>
        </div>
    );
}