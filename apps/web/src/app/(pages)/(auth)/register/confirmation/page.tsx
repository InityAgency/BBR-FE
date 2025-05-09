"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

export default function RegistrationConfirmationPage() {
    const searchParams = useSearchParams();
    const email = searchParams.get("email");
    const [isLoading, setIsLoading] = useState(false);

    const handleResendVerification = async () => {
        if (!email) {
            toast.error('Email address is missing');
            return;
        }

        setIsLoading(true);
        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
            const apiVersion = process.env.NEXT_PUBLIC_API_VERSION || "v1";
            
            const response = await fetch(`${baseUrl}/api/${apiVersion}/auth/resend-verification`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            if (!response.ok) {
                throw new Error('Failed to resend verification email');
            }

            toast.success('Verification email has been resent');
        } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to resend verification email. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center w-full">
            <div className="w-full py-6 lg:p-8">
                <div className="flex flex-col gap-3 mb-1">
                    <div className="relative w-fit">
                        <span className="bg-[#282D2E] w-12 h-12 rounded-full absolute top-0 right-0 -z-2"></span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="73" height="72" viewBox="0 0 73 72" fill="none">
                            <path d="M12.5 57L27.5 42M60.5 57L45.5 42M9.58496 30L31.1738 44.4497C33.0983 45.7328 34.0606 46.3743 35.1007 46.6235C36.0198 46.8438 36.978 46.8438 37.8971 46.6235C38.9372 46.3743 39.8995 45.7328 41.824 44.4497L63.4129 30M31.3944 12.2064L13.9944 23.1338C12.3536 24.1642 11.5332 24.6794 10.9382 25.3759C10.4115 25.9924 10.0153 26.7091 9.77334 27.483C9.5 28.3573 9.5 29.3261 9.5 31.2636V50.4C9.5 53.7603 9.5 55.4405 10.154 56.7239C10.7292 57.8529 11.6471 58.7708 12.7761 59.346C14.0595 60 15.7397 60 19.1 60H53.9C57.2603 60 58.9405 60 60.2239 59.346C61.3529 58.7708 62.2708 57.8529 62.846 56.7239C63.5 55.4405 63.5 53.7603 63.5 50.4V31.2636C63.5 29.3261 63.5 28.3573 63.2267 27.483C62.9847 26.7091 62.5885 25.9924 62.0618 25.3759C61.4668 24.6794 60.6464 24.1642 59.0056 23.1338L41.6056 12.2064C39.7539 11.0435 38.8281 10.462 37.8346 10.2354C36.9561 10.035 36.0439 10.035 35.1654 10.2354C34.1719 10.462 33.2461 11.0435 31.3944 12.2064Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                    <h1 className="text-4xl font-bold text-left lg:text-left">Registration successful!</h1>
                    <p className="mb-2 text-muted-foreground text-md">
                        We've sent a verification email to: <span className="font-medium text-foreground">{email}</span>. 
                        Please check your inbox and click the verification link to complete your registration.
                    </p>
                </div>
            </div>
        </div>
    );
}