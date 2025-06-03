import { Metadata } from "next";
import NewsletterBlock from "@/components/web/Newsletter/NewsletterBlock";
import FAQAccordionBuyer from "@/components/web/Faq/FAQAccordionBuyer";
import RequestConsultationForm from "@/components/web/Forms/RequestConsultation";
import Image from "next/image";
import Link from "next/link";
import SectionLayout from "@/components/web/SectionLayout";

import { generatePageMetadata } from '@/lib/metadata';

export const metadata: Metadata = generatePageMetadata({
  type: 'page',
  data: {
    title: 'Buyer FAQs: Answers to Your Questions from Best Branded Residences',
    description: 'Explore our Buyer FAQs for answers to common questions about purchasing luxury properties. Get expert guidance from Best Brand Residences.',
    slug: 'faq-buyer',
    keywords: ['faq buyer', 'luxury residences', 'company info']
  }
})

const faqData = [
  {
    question: "What is the BBR Guarantee?",
    answer: "Lorem ipsum dolor sit amet consectetur. Congue pharetra et faucibus ante. Nulla rutrum non in morbi duis non convallis in ipsum. Lorem ipsum dolor sit amet consectetur. Congue pharetra et faucibus ante."
  },
  {
    question: "What happens if a property doesn't meet the BBR Guarantee standards?",
    answer: "Lorem ipsum dolor sit amet consectetur. Congue pharetra et faucibus ante. Nulla rutrum non in morbi duis non convallis in ipsum."
  },
  // Add more FAQ items as needed
];

export default function FAQBuyerPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="flex flex-col items-center rounded-b-xl bg-secondary max-w-[calc(100svw-1.5rem)] 2xl:max-w-[calc(100svw-4rem)] mx-auto px-4 lg:px-12 py-12 gap-4 xl:gap-12 mb-12">
        <div className="w-full xl:max-w-[1600px] mx-auto">
          <div className="flex flex-col max-w-3xl items-start gap-4 m-auto ms-0">
            <span className="text-md uppercase text-left lg:text-center text-primary">
              Buyer FAQs
            </span>
            <h1 className="text-4xl font-bold text-left">
              Find Answers to Common Questions About Buying Your Dream Property
            </h1>
          </div>

        </div>
      </div>


      <SectionLayout>
        <div className="w-full xl:max-w-[1600px] mx-auto">
          <FAQAccordionBuyer />
        </div>
      </SectionLayout>

      {/* Contact Expert Section */}
      <section className="bg-secondary">
        <SectionLayout>
          <div className="flex flex-col gap-4 mb-8 items-start lg:max-w-[55%] lg:m-auto mb-4 lg:mb-12 ">
            <span className="text-md lg:text-lg text-left lg:text-center text-primary w-full uppercase">still have any questions?</span>
            <h2 className="text-4xl font-bold text-left lg:text-center w-full">
              Connect with our team of branded residence experts
            </h2>
            <p className="text-left text-md text-muted-foreground w-full lg:text-center">
              Get personalized assistance to any request about branded residences and learn the best solutions for your project needs
            </p>
          </div>
          <div className="w-full xl:max-w-[1600px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Left side - Image and Schedule */}
              <div className="flex flex-col gap-4 items-stretch">
                <div className="border rounded-lg h-full p-4">
                  <Image
                    src="/faq-buyer.webp"
                    alt="Expert Consultant"
                    className="w-full h-full object-cover rounded-md mb-4"
                    width={1000}
                    height={500}
                  />
                </div>
                <div className="border p-4 rounded-lg">
                  <h3 className="text-xl font-medium mb-2">Schedule an online meeting</h3>
                  <p className="text-white/70 mb-4">
                    You can easily schedule your meeting and have a meeting with our consultants in the fastest time possible
                  </p>
                  <Link href="/" className="bg-[#151b1e] hover:bg-[#192024]  border text-white py-3 px-5 rounded-lg transition-colors contact-button text-center flex items-center gap-2 justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
                      <path d="M18 6.25016V5.00016C18 4.55814 17.8244 4.13421 17.5118 3.82165C17.1993 3.50909 16.7754 3.3335 16.3333 3.3335H4.66667C4.22464 3.3335 3.80072 3.50909 3.48816 3.82165C3.17559 4.13421 3 4.55814 3 5.00016V16.6668C3 17.1089 3.17559 17.5328 3.48816 17.8453C3.80072 18.1579 4.22464 18.3335 4.66667 18.3335H7.58333" stroke="white" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M13.8333 1.6665V4.99984" stroke="white" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M7.16669 1.6665V4.99984" stroke="white" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M3 8.3335H7.16667" stroke="white" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M15.0833 14.5832L13.8333 13.5415V11.6665" stroke="white" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M18.8333 13.3335C18.8333 14.6596 18.3065 15.9313 17.3688 16.869C16.4312 17.8067 15.1594 18.3335 13.8333 18.3335C12.5072 18.3335 11.2355 17.8067 10.2978 16.869C9.3601 15.9313 8.83331 14.6596 8.83331 13.3335C8.83331 12.0074 9.3601 10.7356 10.2978 9.79796C11.2355 8.86028 12.5072 8.3335 13.8333 8.3335C15.1594 8.3335 16.4312 8.86028 17.3688 9.79796C18.3065 10.7356 18.8333 12.0074 18.8333 13.3335Z" stroke="white" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Schedule a Call
                  </Link>
                </div>
              </div>

              {/* Right side - Contact Form */}
              <RequestConsultationForm />
            </div>
          </div>
        </SectionLayout>
      </section>

      {/* Newsletter Section */}
      <NewsletterBlock />
    </main>
  );
}
