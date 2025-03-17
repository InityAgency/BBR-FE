// apps/admin/src/app/auth/login/page.tsx
"use client"

import { useEffect, useState } from "react";
import AuthLayout from "../AuthLayout"
import Link from 'next/link'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/contexts/AuthContext"
import { Eye, EyeOff, Loader2 } from "lucide-react"

const FormSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." })
});

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const errorParam = searchParams.get('error');
  
  const { adminLogin, isLoading } = useAuth();
  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Check for URL error parameters
  useEffect(() => {
    if (errorParam) {
      switch (errorParam) {
        case 'session_expired':
          setErrorMessage('Your session has expired. Please log in again.');
          break;
        case 'permission':
          setErrorMessage('You do not have permission to access the admin panel.');
          break;
        default:
          setErrorMessage('An error occurred. Please try again.');
      }
    }
  }, [errorParam]);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    // Reset error state
    setErrorMessage(null);
    form.clearErrors();
    
    try {
      await adminLogin(data.email, data.password, callbackUrl);
      console.log("Login successful, redirecting to:", callbackUrl);
    } catch (error: any) {
      console.error('Login submission error:', error);
      
      // Set form field errors
      if (error.name === 'AuthError') {
        form.setError('email', { message: ' ' });
        form.setError('password', { message: ' ' });
      }
      
      // Set error message if not already handled
      if (!errorMessage) {
        setErrorMessage(error.message || 'Failed to login. Please check your credentials.');
      }
    }
  }

  return (
    <AuthLayout>
      <Form {...form}>
        <div className="flex flex-col items-start gap-2 mb-6">
          <h1 className="text-2xl font-bold">Login to BBR Admin</h1>
          <p className="text-balance text-sm text-muted-foreground">
            Enter your admin credentials to access the dashboard
          </p>
        </div>
      
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="grid gap-2">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="email@example.com" 
                    {...field} 
                    disabled={isLoading}
                    className={form.formState.errors.email ? "border-destructive" : ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="grid gap-2">
                <div className="flex justify-between">
                  <FormLabel>Password</FormLabel>
                  <Link 
                    href="/auth/reset-password-request"
                    className="ml-auto text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••"
                      {...field}
                      disabled={isLoading}
                      className={form.formState.errors.password ? "border-destructive" : ""}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm"
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            className="cursor-pointer transition-all w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </Button>
        </form>
      </Form>
    </AuthLayout>
  )
}