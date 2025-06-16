"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";
import Link from "next/link";

export default function BillingCancelPage() {
    return (
        <div className="flex items-center justify-center h-full min-h-[60svh]">
            <Card className="w-full bg-secondary border-none h-full min-h-[60svh] flex items-center justify-center flex-col">
                <CardHeader className="text-center w-full">
                    <div className="flex justify-center mb-4">
                        <XCircle className="h-16 w-16 text-red-500" strokeWidth={1.5} />
                    </div>
                    <CardTitle className="text-2xl font-medium text-serif">Payment Cancelled</CardTitle>
                    <CardDescription className="text-lg mt-2 space-y-2 lg:max-w-[600px] lg:mx-auto">
                        <p>Your payment process has been cancelled.</p>
                        <p className="text-sm text-muted-foreground">
                            No worries! You can try again whenever you're ready. 
                            If you need any assistance or have questions about our premium features, 
                            feel free to contact our support team.
                        </p>
                    </CardDescription>
                </CardHeader>
                <CardContent className="text-center w-full lg:max-w-[600px] lg:mx-auto">
                    <div className="flex flex-col gap-4">
                        <Link href="/developer/billing/upgrade">
                            <Button variant="default" className="w-full">
                                Try Again
                            </Button>
                        </Link>
                        <Link href="/developer/dashboard">
                            <Button variant="outline" className="w-full">
                                Go to Dashboard
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
} 