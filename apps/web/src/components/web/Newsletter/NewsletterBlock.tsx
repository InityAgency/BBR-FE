import NewsletterForm from "../Forms/NewsletterForm";
import Image from "next/image";
import SectionLayout from "../SectionLayout";
export default function NewsletterBlock() {
    return (
        <SectionLayout>
            <div className="w-full xl:max-w-[1600px] mx-auto">
                <div className="flex flex-col-reverse lg:flex-row w-full border rounded-xl bg-secondary">
                    <div className="flex flex-col-reverse sm:flex-row w-full">
                        {/* Left div - Red - 2/5 width with cross at bottom center */}
                        <div className="overflow-hidden lg:overflow-visible relative flex items-end justify-center sm:w-2/5">
                            <div className="relative flex justify-center lg:absolute bottom-0 lg:left-1/2 lg:-translate-x-1/2">
                                <Image 
                                    src="/newsletter-image.png" 
                                    alt="Newsletter Image" 
                                    width={1000} 
                                    height={1000}
                                    className="w-full h-full object-cover newsletter-image"
                                />
                            </div>
                        </div>

                        {/* Right div - Blue - 3/5 width */}
                        <div className="sm:w-3/5 rounded-t-xl lg:rounded-e-xl flex flex-col gap-4 py-4 md:py-8 lg:py-12 px-4 lg:px-12 xl:pe-40 relative z-1">
                            <span className="text-md uppercase text-left text-primary w-full">NEWSLETTER</span>
                            <h2 className="text-4xl font-bold text-left w-full">Latest of news, insights & info straight into your inbox</h2>
                            <p className="text-lg text-left w-full text-white/70">
                                Discover a world of exclusive luxury living with our curated selection of branded residences. Subscribe for expert insights, latest trends, and in-depth property reviews—delivered straight to your inbox.
                            </p>
                        <NewsletterForm />
                        </div>
                    </div>
                </div>
            </div>
        </SectionLayout>
    );
}