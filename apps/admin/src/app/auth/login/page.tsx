"use client"
import AuthLayout from "../AuthLayout"
import Link from 'next/link'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

// Importing Lucide icons
import { Eye, EyeOff } from "lucide-react"

const FormSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter." })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter." })
    .regex(/[0-9]/, { message: "Password must contain at least one number." }),
})

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("userLoggedIn"); 

    if (isLoggedIn) {
      router.push("/dashboard"); 
    }
  }, [router]);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    // Remove the secure flag for local development
    document.cookie = "userLoggedIn=true; path=/; SameSite=Strict";
    
    // Or use Next.js recommended cookie setting
    // You might want to use a library like js-cookie or Next.js cookies API
    toast.success("Login successful")
    router.push('/dashboard')
  }
  return (
    <AuthLayout>
      <Form {...form}>
        <div className="flex flex-col items-start gap-2 mb-6">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-balance text-sm text-muted-foreground">
            Enter your email below to login to your account
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
                  <Input placeholder="email@example.com" {...field} />
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
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm"
                    >
                      {showPassword ? (
                        <EyeOff size={20} />  // EyeOff icon from Lucide for hiding password
                      ) : (
                        <Eye size={20} />  // Eye icon from Lucide for showing password
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="cursor-pointer transition-all w-full">
            Login
          </Button>
        </form>
      </Form>
    </AuthLayout>
  )
}
