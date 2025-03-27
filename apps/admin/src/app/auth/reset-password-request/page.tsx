"use client"
import AuthLayout from "../AuthLayout"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { toast } from "sonner" 
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { ArrowLeft } from "lucide-react"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import AuthService from "@/services/auth.service"
import { useState } from "react"

const FormSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
})

export default function ResetPasswordRequestPage() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
    },
  })

  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      setIsLoading(true)
      
      // Poziv API-ja za resetovanje lozinke
      await AuthService.requestResetPassword(data.email)
      
      toast.success("Link za resetovanje lozinke je poslat na vaš email.")
      router.push('/auth/reset-password-otp')
    } catch (error) {
      console.error('Greška pri resetovanju lozinke:', error)
      toast.error(error instanceof Error ? error.message : "Došlo je do greške pri resetovanju lozinke.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout>
      <Form {...form}>
        <div className="flex flex-col items-start gap-2 mb-6">
          <Link href="/auth/login" className="text-balance text-sm font-medium text-primary-foreground flex items-center gap-1 hover:text-primary transition-all mb-3">
            <ArrowLeft width={22} height={22}/>
            Login
          </Link>
          <h1 className="text-2xl font-bold">Reset Your Password</h1>
          <p className="text-balance text-sm text-muted-foreground">
            Enter your email below to receive a password reset link.
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

          <Button 
            type="submit" 
            className="cursor-pointer transition-all w-full"
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Send Reset Link"}
          </Button>
        </form>
      </Form>
    </AuthLayout>
  )
}
