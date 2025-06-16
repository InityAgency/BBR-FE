"use client";

import { useEffect, useState } from "react";
import { BillingTable } from "@/components/web/Billing/Table/BillingTable";
import { useBillingTransactions } from "@/hooks/useBillingTransactions";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface UserData {
    company: {
        plan: any | null;
    };
}

export default function DeveloperBilling() {
    const {
        transactions,
        loading,
        totalItems,
        totalPages,
        currentPage,
        goToNextPage,
        goToPreviousPage,
        goToPage,
    } = useBillingTransactions();

    const [userData, setUserData] = useState<UserData | null>(null);
    const [loadingUser, setLoadingUser] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch('/api/v1/auth/me', {
                    credentials: 'include'
                });
                const data = await response.json();
                setUserData(data.data);
            } catch (error) {
                setUserData(null);
            } finally {
                setLoadingUser(false);
            }
        };
        fetchUserData();
    }, []);

    const isPremium = userData?.company?.plan === 'Premium';
    const isFree = userData?.company?.plan === 'Free' || !userData?.company?.plan;

    return (
        <div className="w-full py-8">
            <div className="flex items-center justify-between w-full mb-6">
                <div className="flex items-center gap-4 justify-between w-full">
                    <h1 className="text-2xl font-bold text-sans">Billing History</h1>
                    {/* Plan */}
                    {!loadingUser && (
                        isPremium ? (
                            <div className="w-full lg:w-fit flex flex-row items-center gap-6 px-6 py-2 bg-secondary border rounded-md">
                                <div className="flex flex-col items-start">
                                    <span className="text-white opacity-80 uppercase text-xs">Active plan</span>
                                    <span className="text-serif font-medium text-lg">Premium</span>
                                </div>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <span>
                                                <button
                                                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border shadow-xs hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-9 px-4 py-2 has-[>svg]:px-3 bg-white/5 hover:bg-white/10 text-white border-[#b3804c]"
                                                    disabled
                                                >
                                                    Cancel plan
                                                </button>
                                            </span>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            Coming soon
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                        ) : (
                            <div className="w-full lg:w-fit flex flex-row items-center gap-6 px-6 py-2 bg-secondary border rounded-md">
                            <div className="flex flex-col items-start">
                                <span className="text-white opacity-80 uppercase text-xs">Active plan</span>
                                <span className="text-serif font-medium text-lg">Free</span>
                            </div>
                            <Link href="/developer/billing/upgrade">
                                <Button size="sm" className="ml-2">Upgrade plan</Button>
                            </Link>
                        </div>
                        )
                    )}
                </div>
            </div>

            <BillingTable
                transactions={transactions}
                loading={loading}
                totalItems={totalItems}
                totalPages={totalPages}
                currentPage={currentPage}
                goToNextPage={goToNextPage}
                goToPreviousPage={goToPreviousPage}
                goToPage={goToPage}
            />
        </div>
    );
}       