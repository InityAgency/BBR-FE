import SectionLayout from "@/components/web/SectionLayout";

export default function TermsOfServicePage() {
    return (
        <>
            <div className="flex flex-col items-center rounded-b-xl bg-secondary max-w-[calc(100svw-1.5rem)] 2xl:max-w-[calc(100svw-4rem)] mx-auto px-4 lg:px-12 py-12 gap-4 xl:gap-6 mb-12">
                <h1 className="text-4xl font-bold text-left lg:text-center">Terms of Service</h1>
                <p className="text-lg text-left lg:text-center">Last updated: {new Date().toLocaleDateString()}</p>
            </div>
            <SectionLayout>
                <div className="flex flex-col gap-4">
                    <h2 className="text-2xl font-bold">1. Introduction</h2>
                    <p className="text-lg">Welcome to Best Branded Residences. These Terms and Conditions outline the rules and regulations for the use of our mobile application and services.</p>
                </div>
            </SectionLayout>
        </>
    )
}