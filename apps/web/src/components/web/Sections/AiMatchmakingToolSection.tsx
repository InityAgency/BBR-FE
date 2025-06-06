import Link from "next/link";
import SectionLayout from "../SectionLayout";
import Image from "next/image";
import GetMatchedButton from "../Buttons/GetMatchedButton";

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
                        <GetMatchedButton />
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