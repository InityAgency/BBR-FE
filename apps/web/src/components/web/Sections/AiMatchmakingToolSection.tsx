import Link from "next/link";
import SectionLayout from "../SectionLayout";
import Image from "next/image";

export default function AiMatchmakingToolSection() {
    return (
        <SectionLayout>
            <div className="w-full xl:max-w-[1600px] mx-auto bg-secondary rounded-lg p-12">
                <div className="flex flex-col lg:flex-row gap-6 lg:gap-12 w-full items-center">
                    <div className="w-full lg:w-1/2">
                        <span className="text-md uppercase text-left text-primary inline-block mb-4">AI MATCHMAKING TOOL</span>
                        <h2 className="text-3xl font-bold w-full mb-4 text-left">AI Matchmaking Tool – Find Your Perfect Fit</h2>
                        <p className="text-muted-foreground text-md">
                            Answer a few quick questions, and let our AI match you with residences that fit your lifestyle and investment goals.
                        </p>
                        <div className="flex flex-col lg:flex-row gap-4 mt-6">
                            <Link href="/" className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 h-9 px-4 py-2 has-[>svg]:px-3 w-full lg:w-fit">Get matched</Link>
                            <Link href="/" className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border shadow-xs hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-9 px-4 py-2 has-[>svg]:px-3 bg-white/5 hover:bg-white/10 text-white border-[#b3804c] w-full lg:w-fit">Learn more</Link>
                        </div>
                    </div>
                    <div className="w-full">
                        <div className="w-full rounded-lg overflow-hidden">
                            <Image 
                                src="/matchmaking-section.webp" 
                                alt="AI Matchmaking Tool" 
                                width={600}
                                height={450}
                                className="w-full h-full object-contain" 
                            />
                        </div>
                    </div>
                </div>
            </div>
        </SectionLayout>
    );
}