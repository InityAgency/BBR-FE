import { CircleCheck } from "lucide-react";
import Link from "next/link";

export default function ThankYouPage() {
    return (
        <div className="flex flex-col items-center rounded-b-xl bg-secondary max-w-[calc(100svw-1.5rem)] 2xl:max-w-[calc(100svw-4rem)] mx-auto px-4 lg:px-12 py-12 gap-4 xl:gap-12 mb-12">
        <div className="page-header flex flex-col gap-6 w-full">
            <p className="text-md uppercase text-left lg:text-center text-primary">SCHEDULE A DEMO</p>
            <h1 className="text-4xl font-bold text-left lg:text-center">Book a Time That Suits You</h1>
            <p className="text-left lg:text-center text-lg max-w-full lg:max-w-4xl mx-auto">
                Schedule your personalized consultation with Best Branded Residences. Choose a time that fits your schedule and take the first step toward owning a luxury branded residence.                </p>
        </div>
        <div className="flex flex-col gap-4 w-full -mt-12">
            <div className="flex flex-col gap-4 w-full">
               <div className="bg-white/5 border py-8 px-4 lg:px-32 gap-2 rounded-lg mt-12 max-w-full lg:max-w-3xl min-w-full lg:min-w-3xl mx-auto flex flex-col items-center justify-center">
                    <CircleCheck size={80} strokeWidth={1} color="#B3804C"/>
                    <h2 className="text-2xl font-bold">Your meeting has been scheduled!</h2>
                    <p className="text-center text-lg mb-4 mt-4 text-muted-foreground">
                        Thank you for scheduling the meeting. We appreciate your time and look forward to our conversation.
                    </p>
                    <Link href="/" className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border shadow-xs hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-9 px-4 py-2 has-[>svg]:px-3 bg-white/5 hover:bg-white/10 text-white border-[#b3804c]">
                        Go to the Home page
                    </Link>
               </div>
            </div>
        </div>
    </div>
    )
}