"use client";

import { CheckCircle, ArrowLeft, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export default function VerifyEmailPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { setUser } = useAuth();
    const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const token = searchParams.get("token");
    // Using ref to prevent multiple API calls
    const verificationAttempted = useRef(false);

    useEffect(() => {
        // Avoid sending multiple requests
        if (verificationAttempted.current) return;
        if (!token) {
            console.error("No token in URL");
            setVerificationStatus('error');
            return;
        }
        
        verificationAttempted.current = true;
        
        console.log("Verification started with token:", token);
        
        // Using correct URL schema according to your specification
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";
        const apiVersion = process.env.NEXT_PUBLIC_API_VERSION || "v1";
        const verificationUrl = `${baseUrl}/api/${apiVersion}/users/${token}/verify-email`;
        
        console.log("Sending request to:", verificationUrl);
        
        fetch(verificationUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // Add this to accept and send cookies
        })
        .then(response => {
            console.log("Response status:", response.status);
            
            if (!response.ok) {
                return response.json().then(errData => {
                    console.error("API error:", errData);
                    throw new Error(errData.message || "Verification failed");
                });
            }
            
            return response.json();
        })
        .then(data => {
            console.log("Successful verification:", data);
            
            // Set user in localStorage and auth context
            if (data && data.data) {
                localStorage.setItem('user', JSON.stringify(data.data));
                setUser(data.data);
                
                toast.success("Email successfully verified!");
                setVerificationStatus('success');
                
                // Redirect after short delay
                setTimeout(() => {
                    if (data.data.role?.name === 'developer') {
                        router.push('/developer/onboarding');
                    } else if (data.data.role?.name === 'buyer') {
                        router.push('/buyer/onboarding');
                    } else {
                        router.push('/');
                    }
                }, 2000);
            } else {
                throw new Error("Missing user data in response");
            }
        })
        .catch(error => {
            console.error("Error during verification:", error);
            toast.error("Verification failed.");
            setVerificationStatus('error');
        });
    }, [token, router, setUser]);

    return (

 
            <div className="flex flex-col gap-5">
                {verificationStatus === 'loading' && (
                    <div className="flex flex-col items-center justify-center py-10">
                        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-6"></div>
                        <h1 className="text-2xl font-semibold text-center">Verifying your email...</h1>
                        <p className="text-center text-muted-foreground mt-2">
                            Please wait while we verify your email address.
                        </p>
                    </div>
                )}
                
                {verificationStatus === 'success' && (
                    <div className="flex flex-col items-center justify-center py-8">
                        <CheckCircle size={80} className="text-green-500 mb-6" />
                        <h1 className="text-3xl font-bold text-center mb-3">Verification successful!</h1>
                        <p className="text-center text-muted-foreground mb-8">
                            Your email has been successfully verified. You'll be redirected to your account shortly.
                        </p>
                    </div>
                )}
                
                {verificationStatus === 'error' && (
                    <div className="flex flex-col items-center justify-center py-8">
                        <AlertCircle size={80} className="text-destructive mb-6" />
                        <h1 className="text-3xl font-bold text-center mb-3">Verification failed</h1>
                        <p className="text-center text-muted-foreground mb-8">
                            We couldn't verify your email. The link may be expired or invalid.
                        </p>
                    </div>
                )}
            </div>

    );
}