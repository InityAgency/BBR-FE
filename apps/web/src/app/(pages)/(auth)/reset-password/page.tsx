"use client";

import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { resetTokenService } from "@/app/services/resetTokenService";

const formSchema = z.object({
    password: z.string()
        .min(8, { message: "Password must be at least 8 characters" })
        .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
        .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
        .regex(/[0-9]/, { message: "Password must contain at least one number" })
        .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character" }),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type FormValues = z.infer<typeof formSchema>;

export default function ResetPasswordPage() {
    const [isResetting, setIsResetting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const router = useRouter();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    });

    // Provera tokena kada se stranica učita
    useEffect(() => {
        if (!resetTokenService.isTokenValid()) {
            toast.error('Reset session expired or invalid');
            router.push('/reset-password-request');
        }
    }, [router]);

    const onSubmit = async (data: FormValues) => {
        const resetToken = resetTokenService.getToken();
        if (!resetToken) {
            toast.error('Reset session expired or invalid');
            router.push('/reset-password-request');
            return;
        }

        setIsResetting(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/${process.env.NEXT_PUBLIC_API_VERSION}/auth/reset-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    resetToken: resetToken,
                    newPassword: data.password,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to reset password');
            }

            // Čistimo token nakon uspešnog resetovanja lozinke
            resetTokenService.clearToken();
            
            toast.success('Password has been reset successfully');
            router.push('/login');
        } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to reset password. Please try again.');
        } finally {
            setIsResetting(false);
        }
    };

    return (
        <div className="flex items-center justify-center w-full custom-form">
            <div className="w-full py-6 lg:p-8">
                <div className="flex flex-col gap-3 mb-1">
                    <Link href="/reset-password-request" className="text-balance cursor-pointer text-md font-medium text-primary-foreground flex items-center gap-1 hover:text-primary transition-all mb-3">
                        <ArrowLeft size={20} />
                        Return back
                    </Link>
                    <h1 className="text-4xl font-bold text-left lg:text-left">Create a new password</h1>
                    <p className="mb-2 text-muted-foreground text-md">
                        Please enter your new password below
                    </p>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>New Password</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    {...field}
                                                    type={showPassword ? "text" : "password"}
                                                    placeholder="Enter your new password"
                                                    disabled={isResetting}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                                >
                                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                                </button>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Confirm Password</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    {...field}
                                                    type={showConfirmPassword ? "text" : "password"}
                                                    placeholder="Confirm your new password"
                                                    disabled={isResetting}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                                >
                                                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                                </button>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button 
                                type="submit" 
                                disabled={isResetting}
                                className="w-full"
                            >
                                {isResetting ? "Resetting..." : "Reset Password"}
                            </Button>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    );
}