"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Eye, EyeOff } from "lucide-react";
import { PuffLoader } from 'react-spinners';

const LoginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." })
});

export default function LoginPage() {
  const { login, isLoading, user } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('returnUrl');

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (user) {
      if (returnUrl) {
        // Ako postoji returnUrl, preusmeriti korisnika na tu adresu i zamijeniti history (replace)
        router.replace(returnUrl);
      } else if (user.role?.name === "developer") {
        router.replace('/developer/dashboard');
      } else if (user.role?.name === "buyer") {
        router.replace('/buyer/dashboard');
      }
    }
  }, [user, router, returnUrl]);

  const onSubmit = async (data: z.infer<typeof LoginSchema>) => {
    setErrorMessage(null);
    try {
      await login(data.email, data.password);
    } catch (error: any) {
      setErrorMessage(error.message || "Login failed. Please check your credentials.");
    }
  };

  if (user) {
    return <div className="flex items-center justify-center min-h-[30svh]">
      <PuffLoader color="#b3804c" size={60} />
    </div>;
  }

  return (
    <div className="flex items-center justify-center w-full custom-form">
      <div className="w-full py-6 lg:p-8">
        <div className="flex flex-col gap-3 mb-1">
          <Link href="/" className="text-balance cursor-pointer text-md font-medium text-primary-foreground flex items-center gap-1 hover:text-primary transition-all mb-3"> 
            <ArrowLeft size={20} />
            Return back
          </Link>
          <h1 className="text-4xl font-bold text-left lg:text-left">Welcome back to your BBR account</h1>
          <p className="mb-6 text-muted-foreground text-md">
            Access your account to manage your listings, preferences, and view your personalized dashboard. Stay informed with updates and changes that occurred while you were away.
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 login-form">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter email address" 
                      {...field} 
                      disabled={isLoading}
                      className="bg-transparent" 
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
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        type={showPassword ? "text" : "password"} 
                        placeholder="Enter password" 
                        {...field} 
                        disabled={isLoading}
                        className="bg-transparent pr-10" 
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {errorMessage && <div className="text-destructive text-sm">{errorMessage}</div>}
            <Link href="/reset-password-request" className="text-sm text-primary hover:underline transition-all mb-2 inline-block">Forgot your password?</Link>
            <Button type="submit" className="w-full mt-2" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </Form>
        <div className="mt-4 text-center text-md flex items-center gap-2 justify-center">
          Don't have an account? <a href="/register" className="text-primary underline flex items-center gap-1 text-md">Sign up <ArrowRight width={16} height={16}/></a>
        </div>
      </div>
    </div>
  );
}