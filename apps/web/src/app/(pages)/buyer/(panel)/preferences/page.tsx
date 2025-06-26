"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CountrySelect } from "@/components/web/Forms/CountrySelect";
import { MultiSelect } from "@/components/web/Forms/MultiSelect";

const preferencesSchema = z.object({
    unitTypes: z.array(z.string()).min(1, "Please select at least one unit type"),
    preferredResidenceLocation: z.string().min(2, "Preferred location must be at least 2 characters"),
    lifestyles: z.array(z.string()).min(1, "Please select at least one lifestyle preference"),
    budgetRangeFrom: z.string().refine((val) => !isNaN(Number(val)), {
        message: "Budget must be a number",
    }),
    budgetRangeTo: z.string().refine((val) => !isNaN(Number(val)), {
        message: "Budget must be a number",
    }),
});

type PreferencesFormValues = z.infer<typeof preferencesSchema>;

type UnitType = {
    id: string;
    name: string;
};

type Lifestyle = {
    id: string;
    name: string;
};

export default function Preferences() {
    const [isLoading, setIsLoading] = useState(false);
    const [initialData, setInitialData] = useState<any>(null);
    const [initialLocation, setInitialLocation] = useState<{ id: string; name: string; code: string } | null>(null);
    const [initialUnitTypes, setInitialUnitTypes] = useState<UnitType[]>([]);
    const [initialLifestyles, setInitialLifestyles] = useState<Lifestyle[]>([]);

    const form = useForm<PreferencesFormValues>({
        resolver: zodResolver(preferencesSchema),
        defaultValues: {
            unitTypes: [],
            preferredResidenceLocation: "",
            lifestyles: [],
            budgetRangeFrom: "",
            budgetRangeTo: "",
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

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await apiRequest('auth/me', 'GET');
                const user = response.data;
                setInitialData(user);

                // Log the response to see the structure
                console.log("User data:", user);

                // Extract data from the response
                const buyerData = user.buyer || {};
                
                // Set initial location
                if (buyerData.preferredResidenceLocation) {
                    setInitialLocation(buyerData.preferredResidenceLocation);
                }

                // Set initial unit types and lifestyles
                if (buyerData.unitTypes) {
                    setInitialUnitTypes(buyerData.unitTypes);
                }
                if (buyerData.lifestyles) {
                    setInitialLifestyles(buyerData.lifestyles);
                }
                
                form.reset({
                    unitTypes: buyerData.unitTypes?.map((ut: UnitType) => ut.id) || [],
                    preferredResidenceLocation: buyerData.preferredResidenceLocation?.id || "",
                    lifestyles: buyerData.lifestyles?.map((l: Lifestyle) => l.id) || [],
                    budgetRangeFrom: buyerData.budgetRangeFrom?.toString() || "",
                    budgetRangeTo: buyerData.budgetRangeTo?.toString() || "",
                });

                // Log the form data after reset
                console.log("Form data after reset:", form.getValues());
            } catch (error) {
                console.error('Error fetching user data:', error);
                toast.error('Failed to load preferences');
            }
        };

        fetchUserData();
    }, []);

    const onSubmit = async (data: PreferencesFormValues) => {
        setIsLoading(true);

        try {
            // Prepare preferences data
            const preferencesData = {
                unitTypes: data.unitTypes,
                preferredResidenceLocation: data.preferredResidenceLocation,
                lifestyles: data.lifestyles,
                budgetRangeFrom: Number(data.budgetRangeFrom),
                budgetRangeTo: Number(data.budgetRangeTo),
            };

            console.log("Submitting preferences data:", preferencesData);

            const response = await apiRequest('users/me', 'PUT', preferencesData);
            console.log("Preferences update successful:", response);

            toast.success('Preferences updated successfully');
        } catch (error) {
            console.error('Error updating preferences:', error);
            toast.error('Failed to update preferences');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6 w-full py-8 xl:max-w-2xl custom-form pt-0 lg:pt-8">
            <div>
                <h1 className="text-2xl text-sans font-bold text-left">Preferences</h1>
                <p className="text-muted-foreground mt-2">
                    Update your preferences to help us find the perfect property for you.
                </p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-6">
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
                                    initialOptions={initialUnitTypes}
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
                                            placeholder={initialLocation ? initialLocation.name : "Preferred Residence Location"}
                                        />
                                    </FormControl>
                                    <FormMessage />
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
                                    initialOptions={initialLifestyles}
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
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                                                <Input 
                                                    type="number" 
                                                    placeholder="Minimum budget" 
                                                    className="pl-6"
                                                    {...field} 
                                                />
                                            </div>
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
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                                                <Input 
                                                    type="number" 
                                                    placeholder="Maximum budget" 
                                                    className="pl-6"
                                                    {...field}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                </form>
            </Form>
        </div>
    );
}   