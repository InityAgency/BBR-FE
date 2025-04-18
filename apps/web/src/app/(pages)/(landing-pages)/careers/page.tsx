import Image from "next/image";

export default function CareerPage() {
    return (
        <div>
            <div className="flex flex-col items-center rounded-b-xl bg-secondary max-w-[calc(100svw-1.5rem)] 2xl:max-w-[calc(100svw-4rem)] mx-auto px-4 lg:px-12 py-12 gap-4 xl:gap-12 mb-12">
                <div className="page-header flex flex-col gap-6 w-full rounded-xl bg-black/50 p-4 lg:p-8 py-12 lg:py-32 relative overflow-hidden">
                    <Image src="/career.webp" alt="career" fill  className="w-full h-full object-cover" />
                    <p className="text-md uppercase text-left lg:text-center text-primary z-10">career openings</p>
                    <h1 className="text-4xl font-bold text-left lg:text-center w-full lg:w-[48%] mx-auto z-10">Explore Exciting Career Opportunities and Join Our Team Today</h1>
                </div>    
            </div>
        </div>
    )
}