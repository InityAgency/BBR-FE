"use client"
import { Badge } from "@/components/ui/badge";
import UnderConstruction from "@/components/web/UnderConstruction";
import { Button } from "@/components/ui/button";
import { X, Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useEffect, useState } from "react";

interface UserData {
    company: {
        plan: any | null;
    };
}

export default function DeveloperMarketing() {
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch('/api/v1/auth/me', {
                    credentials: 'include'
                });
                const data = await response.json();
                setUserData(data.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const isPremiumPlan = userData?.company?.plan?.name === 'Premium';
    const isFree = userData?.company?.plan?.name === 'Free' || !userData?.company?.plan?.name;

    return (
        <div className="flex flex-col gap-4 py-8">
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <h1 className="text-xl font-bold sm:text-2xl text-sans">Explore Marketing Add-ons</h1>
                    </div>
                </div>
            </div>
            <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex flex-col gap-4 w-2/3">
                <div className="border rounded-lg p-4 flex gap-4 w-full items-center justify-between">
                    <div className="flex gap-4 w-full items-center">
                        <div>
                            <Image src="/editor-onsite.png" alt="Editor Onsite" width={200} height={200} />
                        </div>
                        <div className="flex flex-col gap-1 w-full">
                            <h2 className="text-lg font-bold text-sans">Editor Onsite+</h2>
                            <p className="text-md text-muted-foreground">
                                Full peace of mind with our physical, on-site verification to certify your residence's quality and authenticity.
                            </p>
                            <span className="text-lg font-bold text-sans">
                                $1,500.00 <span className="text-sm text-muted-foreground">/ one-time</span>
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-1">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button className="w-full" disabled>
                                        Coming Soon
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>This feature will be available soon</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>
                <div className="border rounded-lg p-4 flex gap-4 w-full items-center justify-between">
                    <div className="flex gap-4 w-full items-center">
                        <div>
                            <Image src="/editor-everify.png" alt="Editor eVerify" width={200} height={200} />
                        </div>
                        <div className="flex flex-col gap-1 w-full">
                            <h2 className="text-lg font-bold text-sans">Editor eVerify</h2>
                            <p className="text-md text-muted-foreground">
                                Digital verification to strengthen your property's credibility and ranking.
                            </p>
                            <span className="text-lg font-bold text-sans">
                                $99.00 <span className="text-sm text-muted-foreground">/ one-time</span>
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-1">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button className="w-full" disabled>
                                        Coming Soon
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>This feature will be available soon</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>
                <div className="border rounded-lg p-4 flex gap-4 w-full items-center justify-between">
                    <div className="flex gap-4 w-full items-center">
                        <div>
                            <Image src="/featured-property.png" alt="Featured Property - Homepage" width={200} height={200} />
                        </div>
                        <div className="flex flex-col gap-1 w-full">
                            <h2 className="text-lg font-bold text-sans">Featured Property - Homepage</h2>
                            <p className="text-md text-muted-foreground">
                                Position your property front and center for high-net-worth buyers actively searching for their next investment.
                            </p>
                            <span className="text-lg font-bold text-sans">
                                $700.00<span className="text-sm text-muted-foreground">/ month</span>
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-1">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button className="w-full" disabled>
                                        Coming Soon
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>This feature will be available soon</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>

                <div className="rounded-lg p-4 flex gap-4 w-full items-center justify-between bg-[#171D22]">
                    <div className="flex gap-4 w-full items-center">
                        <div>
                            <Image src="/explore-best-ranking-listing.png" alt="Featured Property - Homepage" width={300} height={300} />
                        </div>
                        <div className="flex flex-col gap-4">
                            <span className="uppercase text-sm text-muted-foreground">BEST chances</span>
                            <h2 className="text-2xl font-bold ">Explore best ranking listing opportunities</h2>
                            <Link href="/best-residences" className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border shadow-xs hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-9 px-4 py-2 has-[>svg]:px-3 bg-white/5 hover:bg-white/10 text-white border-[#b3804c] w-fit">
                                Ranking Management
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
                <div className="flex flex-col gap-4 w-1/3 border rounded-lg px-4 py-6">
                    <span className="uppercase text-sm text-muted-foreground">Active plan</span>
                    <h2 className="text-2xl font-bold">{isPremiumPlan ? "Premium plan" : "Free plan"}</h2>
                    <div className="flex flex-col gap-2">
                    <p className={`text-sm flex flex-row gap-2 ${isPremiumPlan ? 'text-muted-foreground' : 'text-muted-foreground'}`}>
                        {isPremiumPlan ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                        <span>Showcase your brand with enhanced property listings</span>
                    </p>
                    <p className={`text-sm flex flex-row gap-2 ${isPremiumPlan ? 'text-muted-foreground' : 'text-muted-foreground'}`}>
                        {isPremiumPlan ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                        <span>Access leads from buyers who inquire through our platform</span>
                    </p>
                    <p className={`text-sm flex flex-row gap-2 ${isPremiumPlan ? 'text-muted-foreground' : 'text-muted-foreground'}`}>
                        {isPremiumPlan ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                        <span>Boost traffic with advanced SEO and performance analytics</span>
                    </p>
                    <p className={`text-sm flex flex-row gap-2 ${isPremiumPlan ? 'text-muted-foreground' : 'text-muted-foreground'}`}>
                        {isPremiumPlan ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                        <span>Easily upload inventory for visitors to view and inquire about</span>
                    </p>
                    <p className={`text-sm flex flex-row gap-2 ${isPremiumPlan ? 'text-muted-foreground' : 'text-muted-foreground'}`}>
                        {isPremiumPlan ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                        <span>Highlight units with exclusive BBR offers for our visitors</span>
                    </p>
                    <p className={`text-sm flex flex-row gap-2 ${isPremiumPlan ? 'text-muted-foreground' : 'text-muted-foreground'}`}>
                        {isPremiumPlan ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                        <span>Highlight units with exclusive BBR offers for our visitors</span>
                    </p>
                    <p className={`text-sm flex flex-row gap-2 ${isPremiumPlan ? 'text-muted-foreground' : 'text-muted-foreground'}`}>
                        {isPremiumPlan ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                        <span>Get AI-driven insights to improve performance and lead generation</span>
                    </p>
                    <p className={`text-sm flex flex-row gap-2 ${isPremiumPlan ? 'text-muted-foreground' : 'text-muted-foreground'}`}>
                        {isPremiumPlan ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                        <span>Receive expert support from a dedicated marketing consultant</span>
                    </p>
                    </div>
                    {!isPremiumPlan && (
                        <Button className="w-full">
                            Upgrade plan
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}   