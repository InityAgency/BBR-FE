import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import Link from "next/link";
import { MessageCircleQuestion } from "lucide-react";
import SectionLayout from "../SectionLayout";
const faqItems = [
  {
    question: "How can connect with your experts?",
    answer:
      "Connecting with our experts is simple. You can reach out via our contact form, call us directly, or schedule a consultation through our website. Our team is always ready to guide you through your real estate journey with personalized attention.",
  },
  {
    question: "Can i have meeting with consultants for my residences?",
    answer:
      "Get personalized assistance and expert advice from our experienced consultants to make the best decisions for your property needs.Get personalized assistance and expert advice from our experienced consultants to make the best decisions for your property needs.Get personalized assistance and expert advice from our experienced consultants to make the best decisions for your property needs.Get personalized assistance and expert advice from our experienced consultants to make the best decisions for your property needs.",
  },
  {
    question: "How do I connect with a luxury real estate expert?",
    answer:
      "You can connect with a luxury real estate expert by requesting a callback, booking a private consultation online, or visiting one of our regional offices. Our specialists are available to offer tailored insights and help you find the perfect property to match your lifestyle.",
  },
  {
    question: "What services does a luxury real estate expert offer?",
    answer:
      "Our luxury real estate experts provide a comprehensive suite of services including personalized property curation, market analysis, investment advisory, relocation support, and access to exclusive listings. Whether you're buying, selling, or investing, they deliver white-glove service from start to finish.",
  },
  {
    question: "What types of luxury residences are available?",
    answer:
      "We offer a diverse portfolio of luxury residences including beachfront villas, penthouse apartments, designer townhomes, private estates, and high-rise condominiums. Whether you seek serenity, sophistication, or a statement property, there's a perfect home waiting for you.",
  },
];

export default function FaqBlock({ themeLight }: { themeLight?: boolean }) {
  return (
    <div className={`${themeLight && "bg-white"}`}>
      <SectionLayout>
        <div className="flex flex-col lg:flex-row w-full gap-8 xl:max-w-[1600px] mx-auto">
          <div className="flex flex-col gap-6 w-full lg:w-1/2 xl:w-1/3">
            <span className="text-md uppercase text-left lg:text-left text-primary">
              FAQ’s
            </span>
            <h2
              className={`text-4xl font-bold text-left w-full mb-4 ${themeLight && "text-[#101518]"}`}
            >
              Questions? We’re happy to help
            </h2>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 h-9 px-4 py-2 has-[>svg]:px-3 w-fit"
            >
              <MessageCircleQuestion absoluteStrokeWidth />
              Still need help? Contact us.
            </Link>
          </div>
          <div className="w-full">
            <Accordion
              type="single"
              collapsible
              defaultValue="0"
              className="w-full flex flex-col gap-4"
            >
              {faqItems.map((item, index) => (
                <AccordionItem key={index} value={`${index}`}>
                  <AccordionTrigger>
                    <h3
                      className={`text-xl font-medium faq-title ${themeLight && "text-[#171D22]"}`}
                    >
                      {item.question}
                    </h3>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p
                      className={`text-lg text-regular ${themeLight ? "text-[#1A1E21]" : "text-white/70"}`}
                    >
                      {item.answer}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </SectionLayout>
    </div>
  );
}
