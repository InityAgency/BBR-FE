"use client";

import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from 'sonner';
import { useState } from 'react';
import { newsletterService } from "@/app/api/newsletter/newsletter";

export default function NewsletterForm() {
    const [isLoading, setIsLoading] = useState(false);
    
    const formSchema = z.object({
        email: z.string().email(),
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
        },
    })

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            setIsLoading(true);
            
            await newsletterService.subscribe(data.email);
            
            toast.success('Successfully subscribed to the newsletter!');
            form.reset();
        } catch (error) {
            console.error('Error:', error);
            toast.error('An error occurred. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-md space-y-2">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem className="flex flex-col space-y-0.5 w-full">
                            <FormLabel className="text-sm w-full">Email</FormLabel>
                            <div className="flex flex-col sm:flex-row gap-2 w-full">
                                <FormControl>
                                    <Input 
                                        type="email" 
                                        placeholder="Enter your email" 
                                        {...field} 
                                        className="w-full"
                                        disabled={isLoading}
                                    />
                                </FormControl>
                                {/* Mobile version - shown below input, hidden on lg and up */}
                                <FormMessage className="block lg:hidden w-full" />
                                <Button 
                                    type="submit" 
                                    className="w-full sm:w-auto sm:self-end"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Subscribing...' : 'Subscribe'}
                                </Button>
                            </div>
                            {/* Desktop version - shown below everything, hidden below lg */}
                            <FormMessage className="hidden lg:block w-full" />
                        </FormItem>
                    )}
                />
            </form>
        </Form>
    )
}