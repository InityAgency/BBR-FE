"use client";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from 'sonner';
import { useState } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { contactService, formSchema, type FormValues } from "@/app/api/contact/contactService";

export default function ContactForm() {
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            subject: "",
            message: "",
            termsAccepted: false,
            type: "CONTACT_US"
        },
    });

    const onSubmit = async (data: FormValues) => {
        setIsLoading(true);

        try {
            await contactService.sendMessage(data);
            toast.success("Message sent successfully");
            form.reset(); // Reset form after successful submission
        } catch (error) {
            toast.error("Failed to send message");
            console.error("Error sending message:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-4 p-8 h-full flex-col items-center justify-center gap-12 border rounded-lg custom-card contact-form">
            <div className="flex flex-col gap-4">
                <h2 className="text-2xl font-bold w-full">Let's Start a Conversation</h2>
                <p className="text-md text-white/80 w-full">Have questions or want to collaborate? Fill out the form below or reach out via email, and we'll respond as soon as possible.</p>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
                    <div className="flex flex-col lg:flex-row gap-4">
                        <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>First Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>Last Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input {...field} type="email" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    
                    <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Subject</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    
                    <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Message</FormLabel>
                                <FormControl>
                                    <Textarea {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="termsAccepted"
                        render={({ field }) => (
                            <FormItem className="flex items-start gap-2">
                                <FormControl>
                                    <Checkbox 
                                        checked={field.value} 
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel className="text-sm font-medium leading-none">
                                        I agree to the BBR Terms of Service, Privacy Policy
                                    </FormLabel>
                                    <FormMessage />
                                </div>
                            </FormItem>
                        )}
                    />
                    
                    <Button type="submit" disabled={isLoading} className="w-full">
                        {isLoading ? "Sending..." : "Send Message"}
                    </Button>
                </form>
            </Form>
        </div>
    );
}