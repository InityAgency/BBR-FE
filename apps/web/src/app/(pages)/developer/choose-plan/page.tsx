import { UpgradePlan } from "@/components/web/Billing/UpgradePlan";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function ChoosePlan() {
    return (
        <div className="w-full xl:max-w-[1600px] mx-auto px-4 py-8 flex flex-col lg:flex-row justify-between items-start">
            <div className="flex flex-col gap-4 py-8 w-full lg:w-1/5">
                <h1 className="text-4xl font-bold text-left">Select Your Account Plan</h1>
                <p className="text-muted-foreground text-md">
                Choose the best profile type for your property to maximize visibility and engagement with potential buyers.
                </p>
                <p>Not sure which plan is for you?</p>
                <Link href="/schedule-a-demo" className="text-primary text-md font-medium hover:text-primary/80 transition-all">
                    Schedule a call
                </Link>
            </div>
            <UpgradePlan />
        </div>
    );
} 