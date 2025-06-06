"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormDescription } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

const notificationSchema = z.object({
    notifyLatestNews: z.boolean().default(false),
    notifyMarketTrends: z.boolean().default(false),
    notifyBlogs: z.boolean().default(false),
    receiveLuxuryInsights: z.boolean().default(false),
    pushNotifications: z.boolean().default(false),
    emailNotifications: z.boolean().default(false)
});

type NotificationFormValues = z.infer<typeof notificationSchema>;

export default function Notifications() {
    const [isLoading, setIsLoading] = useState(false);
    const [initialData, setInitialData] = useState<any>(null);

    const form = useForm<NotificationFormValues>({
        resolver: zodResolver(notificationSchema),
        defaultValues: {
            notifyLatestNews: false,
            notifyMarketTrends: false,
            notifyBlogs: false,
            receiveLuxuryInsights: false,
            pushNotifications: false,
            emailNotifications: false
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

                form.reset({
                    notifyLatestNews: user.notifyLatestNews || false,
                    notifyMarketTrends: user.notifyMarketTrends || false,
                    notifyBlogs: user.notifyBlogs || false,
                    receiveLuxuryInsights: user.receiveLuxuryInsights || false,
                    pushNotifications: user.pushNotifications || false,
                    emailNotifications: user.emailNotifications || false
                });
            } catch (error) {
                console.error('Error fetching user data:', error);
                toast.error('Failed to load notification preferences');
            }
        };

        fetchUserData();
    }, []);

    const onSubmit = async (data: NotificationFormValues) => {
        setIsLoading(true);

        try {
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

            toast.success('Notification preferences updated successfully');
        } catch (error) {
            console.error('Error updating notification preferences:', error);
            toast.error('Failed to update notification preferences');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6 w-full py-8 xl:max-w-2xl custom-form pt-0 lg:pt-8">
            <div>
                <h1 className="text-2xl text-sans font-bold text-left">Notification Preferences</h1>
                <p className="text-muted-foreground mt-2">
                    Manage your notification preferences and stay updated with the latest information.
                </p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                </form>
            </Form>
        </div>
    );
}