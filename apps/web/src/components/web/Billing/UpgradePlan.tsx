"use client";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Link from "next/link";

const STRIPE_PRICE_ID = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID;
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const API_VERSION = "v1";

interface Plan {
    name: string;
    price: string;
    description: string;
    features: string[];
    badge?: string;
    badgeColor?: string;
    buttonText: string;
    buttonLink?: string;
    buttonVariant?: "default" | "outline";
    cardClass?: string;
    onClick?: () => void;
}

const handleUpgrade = async () => {
    try {
        const response = await fetch(
            `${BASE_URL}/api/${API_VERSION}/billing/checkout/subscription`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    priceId: STRIPE_PRICE_ID,
                    successUrl: `${window.location.origin}/developer/panel/billing/success`,
                    cancelUrl: `${window.location.origin}/developer/panel/billing/cancel`,
                    metadata: {}
                })
            }
        );

        if (!response.ok) {
            throw new Error(`Error during checkout: ${response.status}`);
        }

        const data = await response.json();
        
        if (data?.data?.url) {
            window.location.href = data.data.url;
        }
    } catch (error) {
        console.error("Error during checkout:", error);
    }
};

const plans: Plan[] = [
    {
        name: "Free",
        price: "",
        description: "Perfect for developers with limited budgets who want to gain initial exposure and test the platform before upgrading.",
        features: [
            "Basic property listing with limited features.",
            "Strategic partnership to ensure you get the most",
            "Brief property overview.",
            "Essential contact information."
        ],
        badge: "Current plan",
        badgeColor: "bg-blue-600/20 text-blue-400",
        buttonText: "Current plan",
        buttonVariant: "outline",
        cardClass: "bg-secondary text-white border-0"
    },
    {
        name: "Premium",
        price: "1,500$/month",
        description: "Ideal for developers ready to invest in premium marketing strategies to actively generate leads, increase visibility, and manage a growing portfolio.",
        features: [
            "Includes all Basic Plan features",
            "Showcase your brand with enhanced property listings",
            "Access leads from buyers who inquire through our platform",
            "Boost traffic with advanced SEO and performance analytics",
            "Easily upload inventory for visitors to view and inquire about",
            "Highlight units with exclusive BBR offers for our visitors",
            "Get AI-driven insights to improve performance and lead generation",
            "Receive expert support from a dedicated marketing consultant"
        ],
        badge: "Most Popular",
        badgeColor: "bg-[#B3804C] text-white",
        buttonText: "Upgrade plan",
        buttonVariant: "default",
        cardClass: "bg-[#F7E6D4] text-black border-0",
        onClick: handleUpgrade
    },
    {
        name: "Bespoke",
        price: "Custom plan",
        description: "Great for developers seeking comprehensive, results-driven support with maximum premium exposure, strategic guidance, and a flexible fee structure tied to performance.",
        features: [
            "All Premium Plan features included for enhanced property exposure and lead generation",
            "Strategic partnership to ensure you get the most out of the platform",
            "Tailored strategy for achieving top rankings in relevant categories, including location, lifestyle, and property type",
            "Flexible performance-based pricing options with shared success incentives to align our goals"
        ],
        buttonText: "Schedule a call",
        buttonLink: "/schedule-a-demo",
        buttonVariant: "outline",
        cardClass: "bg-secondary text-white border-0"
    }
];

export function UpgradePlan() {
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

    return (
        <div className="flex items-center justify-center py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
                {plans.map((plan, idx) => (
                    <Card
                        key={plan.name}
                        className={`relative flex flex-col justify-between shadow-xl rounded-2xl p-0 py-2 h-full ${plan.cardClass}`}
                    >
                        <CardHeader className="pb-2 pt-6 px-6">
                            <div className="flex items-center justify-between mb-2">
                                <CardTitle className="text-3xl font-bold font-serif custom-card-title">{plan.name}</CardTitle>
                                {plan.badge && (
                                    <span className={`ml-2 px-3 py-2 rounded-md text-sm font-medium ${plan.badgeColor}`}>{plan.badge}</span>
                                )}
                                
                            </div>

                            <div className="mb-2 plan-price">
                                {plan.price && (
                                    <span className="text-lg font-semibold letter-spacing-1 text-serif">{plan.price}</span>
                                )}
                            </div>

                            <CardDescription className="text-md text-muted-foreground font-normal mb-4  text-inherit">
                                {plan.description}
                            </CardDescription>
                            <Button
                                className={`w-full py-2 text-base font-medium rounded-lg ${idx === 1 ? "bg-[#b48a5a] hover:bg-[#a07a4a] text-white" : ""}`}
                                variant={plan.buttonVariant}
                                disabled={plan.badge === "Current plan"}
                                onClick={plan.onClick}
                            >
                                {plan.buttonLink ? (
                                    <Link href={plan.buttonLink}>{plan.buttonText}</Link>
                                ) : (
                                    plan.buttonText
                                )}
                            </Button>
                          
                        </CardHeader>
                        <CardContent className="px-6 pb-2">

                            <div className="font-semibold mb-2">Features</div>
                            <ul className="space-y-3">
                                {plan.features.map((feature) => (
                                    <li key={feature} className="flex items-start text-md">
                                        <Check className={`h-5 w-5 mt-1 mr-2 ${idx === 1 ? "text-[#b48a5a]" : "text-green-400"}`} />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                        <CardFooter className="px-6 pb-6 pt-4 mt-auto">

                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
} 