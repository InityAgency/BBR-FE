import NewsletterBlock from "@/components/web/Newsletter/NewsletterBlock";
import FaqBlock from "@/components/web/Faq/FaqBlock";
import ContactForm from "@/components/web/Forms/ContactForm";
import Link from "next/link";
import { Mail, Phone } from "lucide-react";
export default function ContactPage() {
    return (
        <div>
            <div className="flex flex-col items-center rounded-b-xl bg-secondary max-w-[calc(100svw-3rem)] 2xl:max-w-[90svw] mx-auto px-4 lg:px-12 py-12 gap-4 xl:gap-12 mb-12">
                <div className="page-header flex flex-col gap-6 w-full">
                    <p className="text-md uppercase text-left lg:text-center text-primary">CONTACT US</p>
                    <h1 className="text-4xl font-bold text-left lg:text-center">Get in Touch with Us</h1>
                    <p className="text-left lg:text-center text-lg max-w-full lg:max-w-4xl mx-auto">
                        Have questions or want to collaborate? Get in touch with us! Whether you're interested in our services, have a project in mind, or need support, our team is here to help. Fill out the form below or reach out via email, and we'll respond as soon as possible.
                    </p>
                </div>

                <div className="contact-form-wrapper w-full lg:w-[80%] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-4">
                        <div className="flex gap-4">
                            <div className="w-1/2">
                                <Link href="mailto:info@bestbrandedresidences.com" className="flex items-center gap-2 p-4 rounded-md grid-cols-1 border bg-white/[4%] hover:bg-white/[8%] transition-colors">
                                    <Mail className="w-6 h-6" />
                                    <p className="text-sm">info@bestbrandedresidences.com</p>
                                </Link>
                            </div>
                            <div className="w-1/2">
                                <Link href="tel:+1 223 664 5599" className="flex items-center gap-2 p-4 rounded-md grid-cols-1 border bg-white/[4%] hover:bg-white/[8%] transition-colors">
                                    <Phone className="w-6 h-6" />
                                    <p className="text-sm">+1 223 664 5599</p>
                                </Link>
                            </div>
                        </div>
                        <div className="w-full">
                            <Link href="https://wa.me/12236645599" className="flex items-center gap-2 p-4 rounded-md grid-cols-2 border bg-white/[4%] hover:bg-white/[8%] transition-colors">
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

                        <div className="border p-4 rounded-md gap-3 flex flex-col">
                            <p className="text-xl font-medium">Request a consultation</p>
                            <p className="text-md">Lorem ipsum dolor sit amet consectetur. Hendrerit sed morbi nisi scelerisque egestas enim enim imperdiet nibh. Imperdiet tortor.</p>
                            <Link href="/#" className="bg-white/[5%] hover:bg-white/[8%] text-white py-3 px-5 rounded-lg transition-colors contact-button text-center flex items-center gap-2 justify-center">
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
                    </div>
                    <div className="flex flex-col gap-4">
                        <ContactForm />
                    </div>
                </div>
            </div>

            <div className="flex flex-col items-center  max-w-[calc(100svw-3rem)] 2xl:max-w-[90svw] mx-auto px-4 lg:px-12 py-12 gap-4 xl:gap-12 mb-12">
                <div className="flex flex-col gap-4">
                    <span className="text-md uppercase text-left lg:text-center text-primary">REPORT TO US</span>
                    <h2 className="text-4xl font-bold text-left lg:text-center">Help Us Improve Best Branded Residences</h2>
                    <p className="text-left lg:text-center text-lg max-w-full lg:max-w-4xl mx-auto">
                        Your feedback matters! Share your ideas or report any issues to help us enhance your experience.
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row w-full lg:w-[80%] gap-4">
                    <Link href="/#" className="flex flex-col lg:flex-row gap-4 items-start lg:items-center border p-4 rounded-lg hover:bg-white/[3%] transition-colors w-full">
                        <svg xmlns="http://www.w3.org/2000/svg" width="72" height="73" viewBox="0 0 72 73" fill="none">
                        <path d="M63 36.5C63 51.4117 50.9117 63.5 36 63.5C21.0883 63.5 9 51.4117 9 36.5C9 21.5883 21.0883 9.5 36 9.5M51 36.5C51 44.7843 44.2843 51.5 36 51.5C27.7157 51.5 21 44.7843 21 36.5C21 28.2157 27.7157 21.5 36 21.5M44.2736 28.5549L56.1506 29.8023L62.5888 20.7888L54.8629 18.2135L52.2876 10.4876L43.2742 16.9258L44.2736 28.5549ZM44.2736 28.5549L36.0001 36.4997" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <div className="flex flex-col gap-2">
                            <p className="text-xl font-medium">I’d like to Suggest a Feauture</p>
                            <p className="text-md text-white/70">Have an idea that could make our platform even better? Let us know how we can innovate and improve.</p>
                        </div>
                    </Link>
                    <Link href="/#" className="flex flex-col lg:flex-row gap-4 items-start lg:items-center border p-4 rounded-lg hover:bg-white/[3%] transition-colors w-full">
                        <svg xmlns="http://www.w3.org/2000/svg" width="73" height="73" viewBox="0 0 73 73" fill="none">
                        <path d="M46.2375 39.5V45.5M46.2375 54.5H46.2675M24.5 24.5V36.5M17 60.261C16.54 60.1657 16.1419 60.0324 15.7761 59.846C14.6471 59.2708 13.7292 58.3529 13.154 57.2239C12.5 55.9405 12.5 54.2603 12.5 50.9V22.1C12.5 18.7397 12.5 17.0595 13.154 15.7761C13.7292 14.6471 14.6471 13.7292 15.7761 13.154C17.0595 12.5 18.7397 12.5 22.1 12.5H50.9C54.2603 12.5 55.9405 12.5 57.2239 13.154C58.3529 13.7292 59.2708 14.6471 59.846 15.7761C60.5 17.0595 60.5 18.7397 60.5 22.1V23M40.7709 63.5001H51.7046C56.8479 63.5001 59.4196 63.5001 60.9684 62.4168C62.3208 61.4709 63.2239 60.0097 63.4651 58.3771C63.7414 56.5073 62.5913 54.2072 60.2911 49.6068L54.8242 38.6731C52.0606 33.1458 50.6788 30.3822 48.8089 29.4953C47.1817 28.7236 45.2938 28.7236 43.6666 29.4953C41.7967 30.3822 40.4149 33.1458 37.6512 38.6731L32.1844 49.6068C29.8842 54.2072 28.7341 56.5073 29.0104 58.3771C29.2516 60.0097 30.1547 61.4709 31.5071 62.4168C33.0559 63.5001 35.6276 63.5001 40.7709 63.5001Z" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <div className="flex flex-col gap-2">
                            <p className="text-xl font-medium">I’d like to Report an Issue</p>
                            <p className="text-md text-white/70">Spotted a bug or something not working as expected? Help us keep everything running smoothly by reporting any issues.</p>
                        </div>
                    </Link>
                </div>
            </div>

            <FaqBlock />
            <NewsletterBlock />
        </div>
    )
}
