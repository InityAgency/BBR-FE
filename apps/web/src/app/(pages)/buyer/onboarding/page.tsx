"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
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
import { useAuth } from "@/contexts/AuthContext";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const buyerOnboardingSchema = z.object({
    phoneNumber: z.string().min(5, "Please enter a valid phone number"),
    preferredContactMethod: z.enum(["email", "phone", "whatsapp"], {
        required_error: "Please select your preferred contact method",
    }),
    budgetRangeFrom: z.string().min(1, "Please enter your minimum budget"),
    budgetRangeTo: z.string().min(1, "Please enter your maximum budget"),
    currentLocation: z.string().min(2, "Please enter your current location"),
    preferredResidenceLocation: z.string().min(2, "Please enter your preferred residence location"),
});

type BuyerOnboardingFormValues = z.infer<typeof buyerOnboardingSchema>;

export default function BuyerOnboarding() {
    const { user } = useAuth();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<BuyerOnboardingFormValues>({
        resolver: zodResolver(buyerOnboardingSchema),
        defaultValues: {
            phoneNumber: "",
            preferredContactMethod: "email",
            budgetRangeFrom: "",
            budgetRangeTo: "",
            currentLocation: "",
            preferredResidenceLocation: "",
        },
    });

    const onSubmit = async (data: BuyerOnboardingFormValues) => {
        setIsLoading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/${process.env.NEXT_PUBLIC_API_VERSION}/buyers/onboarding`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...data,
                    userId: user?.id,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to complete onboarding');
            }

            toast.success('Onboarding completed successfully!');
            router.push('/buyer/dashboard');
        } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to complete onboarding. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container max-w-2xl mx-auto py-8">
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">Welcome to BBR Buyer Platform</h1>
                    <p className="text-muted-foreground mt-2">
                        Let's set up your buyer profile to help us find the perfect property for you.
                    </p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="phoneNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Phone Number</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your phone number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="preferredContactMethod"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Preferred Contact Method</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select your preferred contact method" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="email">Email</SelectItem>
                                            <SelectItem value="phone">Phone</SelectItem>
                                            <SelectItem value="whatsapp">WhatsApp</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="budgetRangeFrom"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Minimum Budget (€)</FormLabel>
                                        <FormControl>
                                            <Input type="number" placeholder="Min budget" {...field} />
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
                                        <FormLabel>Maximum Budget (€)</FormLabel>
                                        <FormControl>
                                            <Input type="number" placeholder="Max budget" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="currentLocation"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Current Location</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your current location" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="preferredResidenceLocation"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Preferred Residence Location</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your preferred residence location" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? "Completing..." : "Complete Onboarding"}
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    );
} 