"use client"
import AuthLayout from "../AuthLayout"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { InputOTP, InputOTPSlot, InputOTPGroup, InputOTPSeparator } from "@/components/ui/input-otp"
import AuthService from "@/services/auth.service"
import { useState, useEffect } from "react"

const FormSchema = z.object({
  otp: z.string().min(6, {
    message: "OTP kod mora imati 6 cifara.",
  }),
})

export default function ResetPasswordOtpPage() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      otp: "",
    },
  })

  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  
  // Provera da li postoji resetToken
  useEffect(() => {
    const resetToken = localStorage.getItem('resetToken')
    if (!resetToken) {
      toast.error("Token za resetovanje nije pronađen. Molimo vas da ponovo pokrenete proces resetovanja lozinke.")
      router.push('/auth/reset-password-request')
    }
  }, [router])

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      setIsLoading(true)
      
      // Poziv API-ja za verifikaciju OTP koda
      const isVerified = await AuthService.verifyOtp(data.otp)
      
      if (isVerified) {
        toast.success("OTP je uspešno verifikovan!")
        router.push('/auth/reset-password')
      } else {
        toast.error("Nevažeći OTP kod. Molimo vas da pokušate ponovo.")
      }
    } catch (error) {
      console.error('Greška pri verifikaciji OTP koda:', error)
      toast.error(error instanceof Error ? error.message : "Došlo je do greške pri verifikaciji OTP koda.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout>
      <Form {...form}>
        <div className="flex flex-col items-start gap-2 mb-6">
          <h1 className="text-2xl font-bold">Unesite OTP kod</h1>
          <p className="text-balance text-sm text-muted-foreground">
            Unesite OTP kod koji je poslat na vašu email adresu.
          </p>
        </div>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="otp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>OTP kod</FormLabel>
                <FormControl className="w-full">
                  <InputOTP {...field} maxLength={6} className="w-full">
                    <InputOTPGroup className="w-full">
                      <InputOTPSlot index={0} className="w-full" />
                      <InputOTPSlot index={1} className="w-full" />
                      <InputOTPSlot index={2} className="w-full" />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup className="w-full">
                      <InputOTPSlot index={3} className="w-full" />
                      <InputOTPSlot index={4} className="w-full" />
                      <InputOTPSlot index={5} className="w-full" />
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button 
            type="submit" 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Verifikacija..." : "Verifikuj OTP"}
          </Button>
        </form>
      </Form>
    </AuthLayout>
  )
}
