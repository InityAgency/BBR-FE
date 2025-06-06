"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import ImageUpload from "@/components/web/Forms/ImageUpload";

const companyInformationSchema = z.object({
    address: z.string().min(2, "Company address must be at least 2 characters"),
    phoneNumber: z.string().min(2, "Phone number must be at least 2 characters"),
    website: z.string().url("Please enter a valid website URL").optional().or(z.literal("")),
});

type CompanyInformationFormValues = z.infer<typeof companyInformationSchema>;

export default function CompanyInformation() {
    const [isLoading, setIsLoading] = useState(false);
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [existingLogo, setExistingLogo] = useState<string | null>(null);

    const form = useForm<CompanyInformationFormValues>({
        resolver: zodResolver(companyInformationSchema),
        defaultValues: {
            address: "",
            phoneNumber: "",
            website: "",
        },
        mode: "onChange"
    });

    // Helper function for API requests
    const apiRequest = async (endpoint: string, method: string, data?: any) => {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL;
        const apiVersion = process.env.NEXT_PUBLIC_API_VERSION;

        console.log('Making API request to:', `${baseUrl}/api/${apiVersion}/${endpoint}`);
        console.log('Request method:', method);
        console.log('Request data:', data);

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

        const responseData = await response.json();
        console.log('API Response:', responseData);
        return responseData;
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
        const fetchCompanyData = async () => {
            try {
                console.log('Fetching company data...');
                const response = await apiRequest('auth/me', 'GET');
                console.log('Received response:', response);
                
                if (response.data && response.data.company) {
                    const companyData = response.data.company;
                    console.log('Setting form data with:', companyData);
                    
                    form.reset({
                        address: companyData.address || "",
                        // Koristimo phoneNumber iz response-a (čak i ako je null ili undefined)
                        phoneNumber: companyData.phoneNumber || "",
                        website: companyData.website || "",
                    });
                    
                    // Postavi postojeći logo ako postoji
                    if (companyData.image && companyData.image.id) {
                        const baseUrl = process.env.NEXT_PUBLIC_API_URL;
                        const apiVersion = process.env.NEXT_PUBLIC_API_VERSION;
                        setExistingLogo(`${baseUrl}/api/${apiVersion}/media/${companyData.image.id}/content`);
                    }
                } else {
                    console.error('No company data in response:', response);
                }
            } catch (error) {
                console.error('Error fetching company data:', error);
                toast.error('Failed to load company information');
            }
        };

        fetchCompanyData();
    }, [form]);

    const onSubmit = async (data: CompanyInformationFormValues) => {
        setIsLoading(true);

        try {
            let imageId = undefined;
            if (logoFile) {
                try {
                    const uploadResponse = await uploadFile(logoFile, 'COMPANY');
                    if (uploadResponse.data && uploadResponse.data.id) {
                        imageId = uploadResponse.data.id;
                    } else {
                        imageId = uploadResponse.id;
                    }
                } catch (uploadError) {
                    console.error("Logo upload failed:", uploadError);
                    toast.error("Failed to upload company logo. Please try again.");
                    setIsLoading(false);
                    return;
                }
            }

            // Pripremi podatke u formatu koji očekuje API
            const companyData = {
                address: data.address,
                phoneNumber: data.phoneNumber, // Koristimo phoneNumber umesto phone_number
                website: data.website || undefined,
            };
            
            // Dodaj image_id samo ako je nova slika postavljena
            if (imageId) {
                // Server očekuje image: { id: 'image_id' } format
                (companyData as any).image = { id: imageId };
            }

            await apiRequest('companies/me', 'PUT', companyData);
            
            // Ažuriraj prikaz loga ako je postavljen novi
            if (imageId) {
                const baseUrl = process.env.NEXT_PUBLIC_API_URL;
                const apiVersion = process.env.NEXT_PUBLIC_API_VERSION;
                setExistingLogo(`${baseUrl}/api/${apiVersion}/media/${imageId}/content`);
            }
            
            toast.success('Company information updated successfully!');
        } catch (error) {
            console.error('Error updating company info:', error);
            toast.error('Failed to update company information');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemoveLogo = () => {
        setExistingLogo(null);
        // Kada korisnik ukloni logo, treba postaviti image na null
        // Ovo će se poslati u API samo ako korisnik klikne Save Changes
    };

    return (
        <div className="space-y-6 w-full py-8 xl:max-w-2xl custom-form pt-0 lg:pt-8">
            <div>
                <h1 className="text-2xl text-sans font-bold text-left">Company Information</h1>
                <p className="text-muted-foreground mt-2">
                    Update your company details to maintain an accurate profile for your branded residence.
                </p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <ImageUpload 
                        onFileChange={setLogoFile} 
                        title={existingLogo ? "Change company logo" : "Upload your company logo"} 
                        preview={existingLogo || undefined}
                        onRemove={handleRemoveLogo}
                    />
                    
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

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isLoading}
                    >
                        {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                </form>
            </Form>
        </div>
    );
}