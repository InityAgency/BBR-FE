import SectionLayout from "@/components/web/SectionLayout";

export default function GdprCompliancePage() {
    return (
        <>
            <div className="flex flex-col items-center rounded-b-xl bg-secondary max-w-[calc(100svw-1.5rem)] 2xl:max-w-[calc(100svw-4rem)] mx-auto px-4 lg:px-12 py-12 gap-4 xl:gap-6 mb-12">
                <h1 className="text-4xl font-bold text-left lg:text-center">GDPR Compliance</h1>
            </div>
            <SectionLayout>
                <div className="flex flex-col gap-4">
                    <p className="text-lg">
                        This GDPR Compliance explains how Best Branded Residences ("we", "us", or "our") uses cookies and similar technologies to enhance your experience on our website.
                    </p>
                </div>
            </SectionLayout>
        </>
    )
}