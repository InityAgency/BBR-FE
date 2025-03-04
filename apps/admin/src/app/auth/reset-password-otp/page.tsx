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

const FormSchema = z.object({
  otp: z.string().min(6, {
    message: "OTP code must be 6 digits.",
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

  function onSubmit(data: z.infer<typeof FormSchema>) {
    if (data.otp === "123456") {
      toast.success("OTP is valid!")
      router.push('/auth/reset-password')
    } else {
      toast.error("Invalid OTP code. Please try again.")
    }
  }

  return (
    <AuthLayout>
      <Form {...form}>
        <div className="flex flex-col items-start gap-2 mb-6">
          <h1 className="text-2xl font-bold">Enter OTP Code</h1>
          <p className="text-balance text-sm text-muted-foreground">
            Enter the OTP code sent to your email.
          </p>
        </div>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="otp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>OTP Code</FormLabel>
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
          <Button type="submit" className="w-full">Verify OTP</Button>
        </form>
      </Form>
    </AuthLayout>
  )
}
