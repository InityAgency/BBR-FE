"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function BillingSuccessPage() {
    return (
        <div className="flex items-center justify-center h-full min-h-[60svh]">
            <Card className="w-full bg-secondary border-none h-full min-h-[60svh] flex items-center justify-center flex-col">
                <CardHeader className="text-center w-full">
                    <div className="flex justify-center mb-4">
                        <CheckCircle2 className="h-16 w-16 text-green-500" strokeWidth={1.5} />
                    </div>
                    <CardTitle className="text-2xl font-medium text-serif">Welcome to Premium!</CardTitle>
                    <CardDescription className="text-lg mt-2 space-y-2 lg:max-w-[600px] lg:mx-auto">
                        <p>Your premium subscription has been successfully activated.</p>
                        <p className="text-sm text-muted-foreground">
                            You now have access to all premium features including enhanced property listings, 
                            advanced analytics, and dedicated support. We're excited to help you grow your business!
                        </p>
                    </CardDescription>
                </CardHeader>
                <CardContent className="text-center w-full">
                    <Link href="/developer/dashboard">
                        <Button className="mt-4">
                            Go to Dashboard
                        </Button>
                    </Link>
                </CardContent>
            </Card>
        </div>
    );
} 