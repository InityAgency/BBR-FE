import NewsletterBlock from "@/components/web/Newsletter/NewsletterBlock";
import FaqBlock from "@/components/web/Faq/FaqBlock";
import ContactForm from "@/components/web/Forms/ContactForm";
import Link from "next/link";
import { ArrowUpRight, Lightbulb, Mail, OctagonAlert, Phone, Calendar } from "lucide-react";
import SectionLayout from "@/components/web/SectionLayout";

import { generatePageMetadata } from '@/lib/metadata'
import type { Metadata } from 'next'

export const metadata: Metadata = generatePageMetadata({
  type: 'page',
  data: {
    title: 'Contact Us: Connect with Best Brand Residences',
    description: 'Contact Us: Connect with Best Brand Residences. Reach out for inquiries, support, or partnership opportunities in the luxury real estate market.',
    slug: 'contact',
    keywords: ['contact us']
  }
})

export default function ContactPage() {
    return (
        <div>
            <div className="flex flex-col items-center rounded-b-xl bg-secondary max-w-[calc(100svw-1.5rem)] 2xl:max-w-[calc(100svw-4rem)] mx-auto px-4 lg:px-12 py-12 gap-4 xl:gap-12 mb-12">
                <div className="page-header flex flex-col gap-6 w-full xl:max-w-[1600px] mx-auto">
                    <p className="text-md uppercase text-left lg:text-center text-primary">CONTACT US</p>
                    <h1 className="text-4xl font-bold text-left lg:text-center">Get in Touch with Us</h1>
                    <p className="text-left lg:text-center text-lg max-w-full lg:max-w-4xl mx-auto">
                        Have questions or want to collaborate? Get in touch with us! Whether you're interested in our services, have a project in mind, or need support, our team is here to help. Fill out the form below or reach out via email, and we'll respond as soon as possible.
                    </p>
                </div>
                <div className="w-full xl:max-w-[1600px] mx-auto">
                    <div className="contact-form-wrapper w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-4">
                            <ContactForm />
                        </div>
                        <div className="flex flex-col gap-4">
                            <div className="border p-4 rounded-md gap-3 flex flex-col">
                                <div className="flex items-center gap-2">
                                    <Calendar size={24} strokeWidth={2} absoluteStrokeWidth className="text-primary"/>
                                    <p className="text-xl font-medium">Request Consultation</p>
                                </div>
                                <p className="text-md">Schedule a personalized consultation with our luxury residence experts to discuss your specific requirements and preferences.</p>
                                <Link href="/request-consultation" className="bg-[#151b1e] hover:bg-[#192024]  border text-white py-3 px-5 rounded-lg transition-colors contact-button text-center flex items-center gap-2 justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
                                    <path d="M18 6.25016V5.00016C18 4.55814 17.8244 4.13421 17.5118 3.82165C17.1993 3.50909 16.7754 3.3335 16.3333 3.3335H4.66667C4.22464 3.3335 3.80072 3.50909 3.48816 3.82165C3.17559 4.13421 3 4.55814 3 5.00016V16.6668C3 17.1089 3.17559 17.5328 3.48816 17.8453C3.80072 18.1579 4.22464 18.3335 4.66667 18.3335H7.58333" stroke="white" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M13.8333 1.6665V4.99984" stroke="white" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M7.16669 1.6665V4.99984" stroke="white" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M3 8.3335H7.16667" stroke="white" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M15.0833 14.5832L13.8333 13.5415V11.6665" stroke="white" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M18.8333 13.3335C18.8333 14.6596 18.3065 15.9313 17.3688 16.869C16.4312 17.8067 15.1594 18.3335 13.8333 18.3335C12.5072 18.3335 11.2355 17.8067 10.2978 16.869C9.3601 15.9313 8.83331 14.6596 8.83331 13.3335C8.83331 12.0074 9.3601 10.7356 10.2978 9.79796C11.2355 8.86028 12.5072 8.3335 13.8333 8.3335C15.1594 8.3335 16.4312 8.86028 17.3688 9.79796C18.3065 10.7356 18.8333 12.0074 18.8333 13.3335Z" stroke="white" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    Request a consultation
                                </Link>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-1/2">
                                    <Link href="mailto:sales@bestbrandedresidences.com" className="flex items-center gap-2 p-4 rounded-md grid-cols-1 border bg-[#151b1e] hover:bg-[#192024]  border  transition-colors">
                                        <Mail size={24} strokeWidth={2} absoluteStrokeWidth className="text-primary"/>
                                        <p className="text-sm">sales@bestbrandedresidences.com</p>
                                    </Link>
                                </div>
                                <div className="w-1/2">
                                    <Link href="tel:+1 223 664 5599" className="flex items-center gap-2 p-4 rounded-md grid-cols-1 border bg-[#151b1e] hover:bg-[#192024]  transition-colors">
                                        <Phone size={24} strokeWidth={2} absoluteStrokeWidth className="text-primary"/>
                                        <p className="text-sm">+1 223 664 5599</p>
                                    </Link>
                                </div>
                            </div>
                            <div className="w-full">
                                <Link href="https://wa.me/12236645599" className="flex items-center gap-2 p-4 rounded-md grid-cols-2 border bg-[#151b1e] hover:bg-[#192024]  transition-colors">
                                    <p className="text-sm">Reach us via WhatsApp </p>
                                </Link>
                            </div>

                            <div className="google-map-wrapper w-full h-72 rounded-md overflow-hidden">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=...tvoj_embed_link...&hl=en"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen={true}
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                ></iframe>
                            </div>

                        
                        </div>
                    
                    </div>
                </div>
            </div>

            <div className="xl:max-w-[1600px] mx-auto">
                <FaqBlock />
            </div>

            <SectionLayout>
                <div className="flex flex-col lg:flex-row xl:max-w-[1600px] mx-auto gap-6">
                    <Link href="/suggest-feature" className="flex flex-col lg:flex-row lg:items-center gap-4 w-full border rounded-xl bg-secondary px-6 py-6 hover:scale-102 transition-transform duration-300">
                        <Lightbulb size={67} strokeWidth={3} absoluteStrokeWidth className="text-primary"/>
                        <div className="flex flex-col gap-3 w-full">
                            <div className="flex flex-row justify-between gap-2 w-full">
                                <h3 className="text-3xl font-medium text-left w-full">Suggest a Feature</h3>
                                <div className="flex flex-col gap-2 bg-black/50 p-2 w-fit rounded-lg">
                                    <ArrowUpRight absoluteStrokeWidth />
                                </div>
                            </div>
                            <p className="text-lg text-left text-white/70 w-full">
                            Have an idea that would enhance your experience with Best Branded Residences? We'd love to hear your suggestions.
                            </p>
                            <p className="text-lg text-left text-primary w-full">Share your idea</p>
                        </div>
                    </Link>

                    <Link href="/report-issue" className="flex flex-col lg:flex-row lg:items-center gap-4 w-full border rounded-xl bg-secondary px-6 py-6 hover:scale-102 transition-transform duration-300">

                        <OctagonAlert size={67} strokeWidth={3} absoluteStrokeWidth className="text-primary"/>
                        <div className="flex flex-col gap-3 w-full">
                            <div className="flex flex-row justify-between gap-2 w-full">
                                <h3 className="text-3xl font-medium text-left w-full">Report an Issue</h3>
                                <div className="flex flex-col gap-2 bg-black/50 p-2 w-fit rounded-lg">
                                    <ArrowUpRight absoluteStrokeWidth />
                                </div>
                            </div>
                            <p className="text-lg text-left text-white/70 w-full">
                            Encountered a problem while exploring our platform? Help us address it promptly by reporting the issue.
                            </p>
                            <p className="text-lg text-left text-primary w-full">Report an issue</p>
                        </div>
                    </Link>
                </div>
            </SectionLayout>

          
            <NewsletterBlock />
        </div>
    )
}
