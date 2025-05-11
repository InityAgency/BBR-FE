import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
export default function ThankYou() {
    return (
        <div className="flex items-center justify-center w-full">
            <div className="w-full py-6 lg:p-8">
                <div className="flex flex-col items-center gap-3 mb-1">
                    <div className="relative w-fit">
                        <Image src="/thank-you.png" alt="Thank you" width={200} height={150} />
                    </div>
                    <h1 className="text-4xl font-bold text-left lg:text-left">Thank you, you’re all set now!</h1>
                    <p className="mb-2 text-muted-foreground text-md text-center">
                        We’ve personalized your experience - explore your tailored search results now.  Please note that you can always update your preferences in your account settings.
                    </p>
                    <Link href="/buyer/dashboard" className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 h-9 px-4 py-2 has-[>svg]:px-3 w-fit"> 
                    Continue
                        <ArrowRight size={20} />    
                    </Link>
                </div>
            </div>
        </div>
    )
}