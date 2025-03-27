"use client"
import AuthLayout from "../AuthLayout"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import AuthService from "@/services/auth.service"

// Importing Lucide icons for "Show/Hide" password functionality
import { Eye, EyeOff } from "lucide-react"

// Move the schema inside the component or to a separate file
const formSchema = z.object({
  newPassword: z.string()
    .min(8, { message: "Lozinka mora biti najmanje 8 karaktera dugačka" })
    .regex(/[A-Z]/, { message: "Lozinka mora sadržati najmanje jedno veliko slovo" })
    .regex(/[a-z]/, { message: "Lozinka mora sadržati najmanje jedno malo slovo" })
    .regex(/[0-9]/, { message: "Lozinka mora sadržati najmanje jedan broj" })
    .regex(/[!@#$%^&*()]/, { message: "Lozinka mora sadržati najmanje jedan specijalni karakter" }),

  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Lozinke se ne podudaraju",
  path: ["confirmPassword"]
})

export default function ResetPasswordPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  })

  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  // Creating separate state for each password field to handle show/hide independently
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Provera da li postoji resetToken
  useEffect(() => {
    const resetToken = localStorage.getItem('resetToken')
    if (!resetToken) {
      toast.error("Token za resetovanje nije pronađen. Molimo vas da ponovo pokrenete proces resetovanja lozinke.")
      router.push('/auth/reset-password-request')
    }
  }, [router])

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true)
      
      // Poziv API-ja za resetovanje lozinke
      const success = await AuthService.resetPassword(data.newPassword)
      
      if (success) {
        toast.success("Vaša lozinka je uspešno resetovana.")
        router.push('/auth/login')
      } else {
        toast.error("Neuspelo resetovanje lozinke. Molimo vas da pokušate ponovo.")
      }
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
          <h1 className="text-2xl font-bold">Resetujte svoju lozinku</h1>
          <p className="text-balance text-sm text-muted-foreground">
            Unesite svoju novu lozinku.
          </p>
        </div>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* New Password Field */}
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nova lozinka</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showNewPassword ? "text" : "password"}
                      placeholder="••••••"
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm"
                    >
                      {showNewPassword ? (
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

          {/* Confirm Password Field */}
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Potvrdite lozinku</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••"
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm"
                    >
                      {showConfirmPassword ? (
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
            {isLoading ? "Resetovanje..." : "Resetuj lozinku"}
          </Button>
        </form>
      </Form>
    </AuthLayout>
  )
}