import SectionLayout from "@/components/web/SectionLayout";
import NewsletterBlock from "@/components/web/Newsletter/NewsletterBlock";
import Link from "next/link";
import { Mail, Phone, Calendar } from "lucide-react";
import RequestConsultationForm from "@/components/web/Forms/RequestConsultation";
import Image from "next/image";
import { generatePageMetadata } from '@/lib/metadata'
import type { Metadata } from 'next'

export const metadata: Metadata = generatePageMetadata({
  type: 'page',
  data: {
    title: 'Request a Consultation ',
    description: 'Request a Consultation: Tailored Luxury Solutions by Best Brand Residences. Schedule a personalized session to find luxury branded residences for your needs.',
    slug: 'request-consultation',
    keywords: ['request a consultation']
  }
})

export default function RequestAConsultationPage() {
    return (
        <>
            <div className="flex flex-col items-center rounded-b-xl bg-secondary max-w-[calc(100svw-1.5rem)] 2xl:max-w-[calc(100svw-4rem)] mx-auto px-4 lg:px-12 py-12 gap-4 xl:gap-12 mb-12">
                <div className="page-header flex flex-col gap-6 w-full xl:max-w-[1600px] mx-auto">
                    <p className="text-md uppercase text-left lg:text-center text-primary">REQUEST A CONSULTATION</p>
                    <h1 className="text-4xl font-bold text-left lg:text-center w-full lg:w-[40%] mx-auto">Connect with Your Personal Luxury Real Estate Expert</h1>
                    <p className="text-left lg:text-center text-lg max-w-full lg:max-w-2xl mx-auto">
                        Get personalized assistance and expert advice from our experienced consultants to make the best decisions for your property needs.
                    </p>
                </div>

                <div className="contact-form-wrapper w-full lg:w-[80%] xl:max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-4">
                        <RequestConsultationForm />
                    </div>
                    <div className="flex flex-col gap-4">
                        <div className="border p-4 rounded-md gap-3 flex flex-col">
                            <Image src="/request-consultation.webp" alt="Request Consultation" width={300} height={300} className="w-full h-full object-cover rounded-lg" />
                        </div>
                        <div className="border p-4 rounded-md gap-3 flex flex-col">
                            <div className="flex items-center gap-2">
                                <Calendar size={24} strokeWidth={2} absoluteStrokeWidth className="text-primary" />
                                <p className="text-xl font-medium">Schedule an online meeting</p>
                            </div>
                            <p className="text-md">You can easily schedule your meeting and have a meeting with our consultants in the fastest time possible.</p>
                            <Link href="/schedule-a-demo" className="bg-[#151b1e] hover:bg-[#192024]  border text-white py-3 px-5 rounded-lg transition-colors contact-button text-center flex items-center gap-2 justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
                                    <path d="M18 6.25016V5.00016C18 4.55814 17.8244 4.13421 17.5118 3.82165C17.1993 3.50909 16.7754 3.3335 16.3333 3.3335H4.66667C4.22464 3.3335 3.80072 3.50909 3.48816 3.82165C3.17559 4.13421 3 4.55814 3 5.00016V16.6668C3 17.1089 3.17559 17.5328 3.48816 17.8453C3.80072 18.1579 4.22464 18.3335 4.66667 18.3335H7.58333" stroke="white" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M13.8333 1.6665V4.99984" stroke="white" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M7.16669 1.6665V4.99984" stroke="white" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M3 8.3335H7.16667" stroke="white" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M15.0833 14.5832L13.8333 13.5415V11.6665" stroke="white" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M18.8333 13.3335C18.8333 14.6596 18.3065 15.9313 17.3688 16.869C16.4312 17.8067 15.1594 18.3335 13.8333 18.3335C12.5072 18.3335 11.2355 17.8067 10.2978 16.869C9.3601 15.9313 8.83331 14.6596 8.83331 13.3335C8.83331 12.0074 9.3601 10.7356 10.2978 9.79796C11.2355 8.86028 12.5072 8.3335 13.8333 8.3335C15.1594 8.3335 16.4312 8.86028 17.3688 9.79796C18.3065 10.7356 18.8333 12.0074 18.8333 13.3335Z" stroke="white" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Schedule A Call
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
            <SectionLayout>
                <div className="flex flex-col gap-4 bg-secondary rounded-xl p-4 lg:p-12 w-full xl:max-w-[1600px] mx-auto">
                    <span className="text-md lg:text-lg text-left lg:text-center text-primary w-full">NEW SOLUTION</span>
                    <h2 className="text-4xl font-bold w-[100%] lg:w-[60%] text-left lg:text-center mx-auto">The Smartest Way to Buy, Invest & Discover Branded Residences</h2>
                    <p className="text-md lg:text-lg w-full lg:w-[50%] text-left lg:text-center mx-auto text-white/70">
                        From iconic penthouses to high-ROI investments, explore properties ranked by trust, quality, and long-term value.</p>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-16 w-full">
                        <div className="flex flex-col justify-center w-full custom-card rounded-2xl p-6 border">
                            <div className="flex flex-row gap-4 items-center mb-4">
                                <div className="relative">
                                    <span className="absolute -top-2 -left-2 rounded-full bg-white/10 w-12 h-12"></span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
                                        <path d="M17 25L20.0178 28.0178C20.7053 28.7053 21.0491 29.0491 21.4396 29.1643C21.7827 29.2656 22.1499 29.2489 22.4824 29.117C22.8609 28.9669 23.1722 28.5934 23.7946 27.8465L32 18M32.6575 9.5171C34.1351 9.55927 35.6001 10.1442 36.7279 11.272C37.8557 12.3998 38.4407 13.8648 38.4828 15.3424C38.5246 16.8046 38.5454 17.5357 38.5883 17.7059C38.6802 18.0702 38.5735 17.8125 38.7661 18.135C38.8561 18.2857 39.3584 18.8175 40.3627 19.8809C41.3777 20.9556 42 22.4051 42 24C42 25.5949 41.3777 27.0444 40.3627 28.1191C39.3584 29.1825 38.8561 29.7143 38.7661 29.865C38.5735 30.1875 38.6802 29.9298 38.5883 30.2941C38.5454 30.4643 38.5246 31.1954 38.4828 32.6576C38.4407 34.1352 37.8557 35.6002 36.7279 36.728C35.6001 37.8558 34.1351 38.4407 32.6575 38.4829C31.1953 38.5246 30.4642 38.5455 30.294 38.5884C29.9298 38.6803 30.1874 38.5735 29.8649 38.7661C29.7142 38.8561 29.1825 39.3584 28.1191 40.3627C27.0444 41.3777 25.5949 42 24 42C22.4051 42 20.9556 41.3777 19.8809 40.3628C18.8175 39.3583 18.2857 38.8561 18.1351 38.7661C17.8125 38.5735 18.0702 38.6802 17.7059 38.5884C17.5358 38.5455 16.8045 38.5246 15.3424 38.4829C13.8648 38.4407 12.3997 37.8558 11.2719 36.728C10.1441 35.6002 9.55918 34.1351 9.51703 32.6575C9.47533 31.1953 9.45447 30.4642 9.41156 30.294C9.3197 29.9298 9.42643 30.1874 9.23382 29.8649C9.14384 29.7142 8.64164 29.1825 7.63723 28.119C6.62226 27.0444 6 25.5949 6 24C6 22.4051 6.62226 20.9556 7.63723 19.881C8.64164 18.8175 9.14384 18.2858 9.23382 18.1351C9.42643 17.8126 9.3197 18.0702 9.41156 17.706C9.45447 17.5358 9.47533 16.8047 9.51703 15.3425C9.55918 13.8649 10.1441 12.3998 11.2719 11.272C12.3997 10.1442 13.8648 9.55926 15.3424 9.5171C16.8046 9.47539 17.5358 9.45453 17.7059 9.41162C18.0702 9.31976 17.8125 9.4265 18.1351 9.23388C18.2857 9.14389 18.8175 8.64164 19.8809 7.63725C20.9556 6.62226 22.4051 6 24 6C25.5949 6 27.0444 6.62227 28.1191 7.63728C29.1825 8.64168 29.7142 9.14388 29.8649 9.23386C30.1874 9.42648 29.9298 9.31975 30.294 9.41161C30.4642 9.45452 31.1953 9.47538 32.6575 9.5171Z" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold">Verified Global Luxury Residences</h3>
                            </div>
                            <p>Every property is carefully vetted for quality, prestige, and long-term value.</p>
                        </div>

                        <div className="flex flex-col justify-center w-full custom-card rounded-2xl p-6 border">
                            <div className="flex flex-row gap-4 items-center mb-4">
                                <div className="relative">
                                    <span className="absolute -top-2 -left-2 rounded-full bg-white/10 w-12 h-12"></span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
                                        <path d="M44 16H40M40 16H38C34 12.0036 28 7.9996 24 12M40 16V32M24 12L17.9991 18.0033C17.8404 18.1621 17.761 18.2414 17.6972 18.3117C16.31 19.8379 16.3106 22.1686 17.6985 23.6941C17.7624 23.7643 17.842 23.8438 18.0006 24.0024C18.1593 24.161 18.2387 24.2403 18.309 24.3042C19.8349 25.6908 22.1647 25.6904 23.6902 24.3033C23.7604 24.2395 23.8398 24.1601 23.9984 24.0014L25.9992 22.0007M24 12C20 7.9996 14 12.0037 10 16.0001H8M4 16.0001H8M8 16.0001V32M40 32V38H44M40 32H34.3431M30 26L33 29C33.1592 29.1592 33.239 29.239 33.3031 29.3095C34.6898 30.8351 34.6898 33.1649 33.3031 34.6905C33.239 34.761 33.1592 34.8408 33 35C32.8408 35.1592 32.761 35.239 32.6905 35.3031C31.1649 36.6899 28.8351 36.6899 27.3095 35.3031C27.239 35.239 27.1592 35.1592 27 35L26 34C24.9095 35.0905 24.3643 35.6358 23.7761 35.9272C22.657 36.4818 21.343 36.4818 20.2239 35.9272C19.6358 35.6358 19.0905 35.0905 18 34C16.6217 35.8378 13.7913 35.5825 12.7639 33.5279L12 32H8M8 32V38H4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold">Exclusive Developer Partnerships</h3>
                            </div>
                            <p>Get direct access to top-tier branded residences from leading global developers.</p>
                        </div>

                        <div className="flex flex-col justify-center w-full custom-card rounded-2xl p-6 border">
                            <div className="flex flex-row gap-4 items-center mb-4">
                                <div className="relative">
                                    <span className="absolute -top-2 -left-2 rounded-full bg-white/10 w-12 h-12"></span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
                                        <path d="M42 42H15.6C12.2397 42 10.5595 42 9.27606 41.346C8.14708 40.7708 7.2292 39.8529 6.65396 38.7239C6 37.4405 6 35.7603 6 32.4V6M12 30L20 22L28 30L40 18M40 18V26M40 18H32" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold">Data-Driven Investment Insights</h3>
                            </div>
                            <p>Access ROI projections, rental yield reports, and market trends to make smarter buying decisions.	</p>
                        </div>

                        <div className="flex flex-col justify-center w-full custom-card rounded-2xl p-6 border">
                            <div className="flex flex-row gap-4 items-center mb-4">
                                <div className="relative">
                                    <span className="absolute -top-2 -left-2 rounded-full bg-white/10 w-12 h-12"></span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
                                        <path d="M10.0012 14V22M20.0012 4V12M36.0012 32V40M6.00116 18H14.0012M16.0012 8H24.0012M32.0012 36H40.0012M28.0012 14L33.658 19.6569M39.0344 7.49223L40.1658 8.6236C40.9578 9.41564 41.3538 9.81166 41.5022 10.2683C41.6327 10.67 41.6327 11.1027 41.5022 11.5044C41.3538 11.961 40.9578 12.3571 40.1658 13.1491L13.0521 40.2628C12.2601 41.0548 11.8641 41.4508 11.4074 41.5992C11.0057 41.7297 10.573 41.7297 10.1713 41.5992C9.71467 41.4508 9.31866 41.0548 8.52662 40.2628L7.39525 39.1314C6.60322 38.3394 6.2072 37.9433 6.05882 37.4867C5.92831 37.085 5.92831 36.6523 6.05882 36.2506C6.2072 35.794 6.60322 35.3979 7.39525 34.6059L34.5089 7.49224C35.301 6.7002 35.697 6.30418 36.1536 6.15581C36.5553 6.02529 36.988 6.02529 37.3897 6.15581C37.8464 6.30418 38.2424 6.7002 39.0344 7.49223Z" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold">AI-Powered Property Matchmaking</h3>
                            </div>
                            <p>Our SmartMatch AI recommends the best properties based on your goals, lifestyle, and budget.	</p>
                        </div>

                        <div className="flex flex-col justify-center w-full custom-card rounded-2xl p-6 border">
                            <div className="flex flex-row gap-4 items-center mb-4">
                                <div className="relative">
                                    <span className="absolute -top-2 -left-2 rounded-full bg-white/10 w-12 h-12"></span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
                                        <path d="M21 42H8C8 34.9471 13.2154 29.1122 20 28.1418M32.9952 32.4239C31.5957 30.8656 29.2618 30.4464 27.5083 31.8733C25.7547 33.3003 25.5079 35.686 26.8849 37.3736C27.6624 38.3264 29.5095 39.9967 30.9708 41.2706C31.6638 41.8748 32.0103 42.1769 32.4294 42.3005C32.7867 42.4059 33.2037 42.4059 33.561 42.3005C33.9801 42.1769 34.3266 41.8748 35.0196 41.2706C36.4809 39.9967 38.328 38.3264 39.1055 37.3736C40.4825 35.686 40.2658 33.2852 38.4821 31.8733C36.6984 30.4614 34.3948 30.8656 32.9952 32.4239ZM30 14C30 18.4183 26.4183 22 22 22C17.5817 22 14 18.4183 14 14C14 9.58172 17.5817 6 22 6C26.4183 6 30 9.58172 30 14Z" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold">First People oriented real-estate platform </h3>
                            </div>
                            <p>Real estate should be about people, not just properties. We connect buyers, investors, and developers with curated listings - ensuring a seamless, personalized experience.	</p>
                        </div>

                        <div className="flex flex-col justify-center w-full custom-card rounded-2xl p-6 border">
                            <div className="flex flex-row gap-4 items-center mb-4">
                                <div className="relative">
                                    <span className="absolute -top-2 -left-2 rounded-full bg-white/10 w-12 h-12"></span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
                                        <path d="M21 42H8C8 34.9471 13.2154 29.1122 20 28.1418M32.9952 32.4239C31.5957 30.8656 29.2618 30.4464 27.5083 31.8733C25.7547 33.3003 25.5079 35.686 26.8849 37.3736C27.6624 38.3264 29.5095 39.9967 30.9708 41.2706C31.6638 41.8748 32.0103 42.1769 32.4294 42.3005C32.7867 42.4059 33.2037 42.4059 33.561 42.3005C33.9801 42.1769 34.3266 41.8748 35.0196 41.2706C36.4809 39.9967 38.328 38.3264 39.1055 37.3736C40.4825 35.686 40.2658 33.2852 38.4821 31.8733C36.6984 30.4614 34.3948 30.8656 32.9952 32.4239ZM30 14C30 18.4183 26.4183 22 22 22C17.5817 22 14 18.4183 14 14C14 9.58172 17.5817 6 22 6C26.4183 6 30 9.58172 30 14Z" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold">Industry-Leading Rankings & Ratings</h3>
                            </div>
                            <p>Discover the Top 10 luxury homes, best high-rise investments, and top waterfront properties.	</p>
                        </div>
                    </div>
                </div>
            </SectionLayout>
            
            <NewsletterBlock />
        </>
    )
}