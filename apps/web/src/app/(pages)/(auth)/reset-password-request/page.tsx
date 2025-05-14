"use client";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useState } from "react";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { resetTokenService } from "@/app/services/resetTokenService";

const formSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email address" }),
});

type FormValues = z.infer<typeof formSchema>;

export default function ResetPasswordRequestPage() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
        },
    });

    const onSubmit = async (data: FormValues) => {
        setIsLoading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/${process.env.NEXT_PUBLIC_API_VERSION}/auth/request-reset-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Failed to send reset password request');
            }

            const responseData = await response.json();
            toast.success('Reset password OTP has been sent to your email');
            
            // Čuvamo token u servisu umesto direktno u sessionStorage
            const token = responseData.data.resetToken;
            resetTokenService.saveToken(token);
            
            router.push(`/verify-otp?email=${encodeURIComponent(data.email)}`);
        } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to send reset password request. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center w-full custom-form">
            <div className="w-full py-6 lg:p-8">
                <div className="flex flex-col gap-3 mb-1">
                    <Link href="/login" className="text-balance cursor-pointer text-md font-medium text-primary-foreground flex items-center gap-1 hover:text-primary transition-all mb-3">
                        <ArrowLeft size={20} />
                        Return back
                    </Link>
                    <h1 className="text-4xl font-bold text-left lg:text-left">Reset your password</h1>
                    <p className="mb-6 text-muted-foreground text-md">
                        Enter the email address associated with your BBR account and we'll send you a link to reset your password.
                    </p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email Address</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="email"
                                            placeholder="Enter your email"
                                            disabled={isLoading}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? "Sending..." : "Send Reset Code"}
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    );
}