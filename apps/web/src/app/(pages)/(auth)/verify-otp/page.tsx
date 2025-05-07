"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useSearchParams, useRouter } from "next/navigation";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { resetTokenService } from "@/app/services/resetTokenService";

const formSchema = z.object({
    otp: z.string().min(6, { message: "OTP must be 6 characters" }).max(6),
});

type FormValues = z.infer<typeof formSchema>;

export default function VerifyOtpPage() {
    const [isResending, setIsResending] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const searchParams = useSearchParams();
    const router = useRouter();
    const email = searchParams.get('email');

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            otp: "",
        },
    });

    // Provera tokena kada se stranica učita
    useEffect(() => {
        if (!resetTokenService.isTokenValid()) {
            toast.error('Reset session expired or invalid');
            router.push('/reset-password-request');
        }
    }, [router]);

    const handleResendEmail = async () => {
        if (!email) {
            toast.error('Email address is missing');
            return;
        }
        
        setIsResending(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/${process.env.NEXT_PUBLIC_API_VERSION}/auth/request-reset-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            if (!response.ok) {
                throw new Error('Failed to resend reset password email');
            }

            const responseData = await response.json();
            
            // Ažuriramo token sa novim koji je dobijen iz resend zahteva
            if (responseData.data && responseData.data.resetToken) {
                resetTokenService.updateToken(responseData.data.resetToken);
            }
            
            toast.success('Reset password OTP has been resent to your email');
        } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to resend reset password email. Please try again.');
        } finally {
            setIsResending(false);
        }
    };

    const onSubmit = async (data: FormValues) => {
        // Direktna verifikacija OTP-a bez analize odgovora
        verifyOtp(data.otp);
    };
    
    // Nova funkcija koja potpuno zaobilazi analizu odgovora
    const verifyOtp = async (otpCode: string) => {
        const resetToken = resetTokenService.getToken();
        if (!resetToken) {
            toast.error('Reset session expired or invalid');
            router.push('/reset-password-request');
            return;
        }

        setIsVerifying(true);
        
        // Kreiraj URL i podatke za fetch
        const url = `${process.env.NEXT_PUBLIC_API_URL}/api/${process.env.NEXT_PUBLIC_API_VERSION}/auth/verify-otp`;
        const requestBody = {
            resetToken,
            otp: otpCode
        };
        
        // Korišćenje XMLHttpRequest umesto fetch
        const xhr = new XMLHttpRequest();
        xhr.open('POST', url, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        
        xhr.onload = function() {
            // Proveravamo samo status kod, ne analiziramo odgovor
            if (xhr.status >= 200 && xhr.status < 300) {
                // Uspeh - idemo na sledeću stranicu
                toast.success('OTP verified successfully');
                setTimeout(() => {
                    router.push('/reset-password');
                }, 300);
            } else {
                // Greška - prikazujemo poruku
                toast.error('Failed to verify OTP. Please try again.');
            }
            setIsVerifying(false);
        };
        
        xhr.onerror = function() {
            // Greška u komunikaciji
            toast.error('Network error. Please try again.');
            setIsVerifying(false);
        };
        
        // Šaljemo zahtev
        xhr.send(JSON.stringify(requestBody));
    };
    
    return (
        <div className="flex items-center justify-center w-full">
            <div className="w-full py-6 lg:p-8">
                <div className="flex flex-col gap-3 mb-1">
                    <Link href="/reset-password-request" className="text-balance cursor-pointer text-md font-medium text-primary-foreground flex items-center gap-1 hover:text-primary transition-all mb-3">
                        <ArrowLeft size={20} />
                        Return back
                    </Link>
                    <div className="relative w-fit">
                        <span className="bg-[#282D2E] w-12 h-12 rounded-full absolute top-0 right-0 -z-2"></span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="73" height="72" viewBox="0 0 73 72" fill="none">
                        <path d="M12.5 57L27.5 42M60.5 57L45.5 42M9.58496 30L31.1738 44.4497C33.0983 45.7328 34.0606 46.3743 35.1007 46.6235C36.0198 46.8438 36.978 46.8438 37.8971 46.6235C38.9372 46.3743 39.8995 45.7328 41.824 44.4497L63.4129 30M31.3944 12.2064L13.9944 23.1338C12.3536 24.1642 11.5332 24.6794 10.9382 25.3759C10.4115 25.9924 10.0153 26.7091 9.77334 27.483C9.5 28.3573 9.5 29.3261 9.5 31.2636V50.4C9.5 53.7603 9.5 55.4405 10.154 56.7239C10.7292 57.8529 11.6471 58.7708 12.7761 59.346C14.0595 60 15.7397 60 19.1 60H53.9C57.2603 60 58.9405 60 60.2239 59.346C61.3529 58.7708 62.2708 57.8529 62.846 56.7239C63.5 55.4405 63.5 53.7603 63.5 50.4V31.2636C63.5 29.3261 63.5 28.3573 63.2267 27.483C62.9847 26.7091 62.5885 25.9924 62.0618 25.3759C61.4668 24.6794 60.6464 24.1642 59.0056 23.1338L41.6056 12.2064C39.7539 11.0435 38.8281 10.462 37.8346 10.2354C36.9561 10.035 36.0439 10.035 35.1654 10.2354C34.1719 10.462 33.2461 11.0435 31.3944 12.2064Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                    <h1 className="text-4xl font-bold text-left lg:text-left">Check your email</h1>
                    <p className="mb-2 text-muted-foreground text-md">
                        We've sent a verification code to <span className="font-medium text-foreground">{email}</span>
                    </p>
                    <p className="text-muted-foreground text-md mb-4">
                        Please enter the 6-digit code from your email to continue with password reset.
                    </p>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="otp"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Verification Code</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="Enter 6-digit code"
                                                maxLength={6}
                                                disabled={isVerifying}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex flex-col gap-4">
                                <Button 
                                    type="submit" 
                                    disabled={isVerifying}
                                    className="w-full"
                                >
                                    {isVerifying ? "Verifying..." : "Verify Code"}
                                </Button>
                                <Button 
                                    onClick={handleResendEmail} 
                                    disabled={isResending}
                                    variant="outline"
                                    type="button"
                                >
                                    {isResending ? "Resending..." : "Resend Code"}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    );
}