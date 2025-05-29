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
    question: "How does BBR verify property quality?",
    answer:
      "BBR uses an expert review process and gathers authentic feedback to verify the accuracy of all property details. Connecting with residences through BBR ensures you’re engaging with verified listings and trustworthy sellers, backed by our commitment to quality and transparency. Our platform provides detailed information, professional evaluations, and a secure environment, giving you peace of mind that the property you’re interested in meets our high standards.",
  },
  {
    question: "How does the BBR Guarantee protect me as a buyer?",
    answer:
      "BBR uses an expert review process and gathers authentic feedback to verify the accuracy of all property details. Connecting with residences through BBR ensures you’re engaging with verified listings and trustworthy sellers, backed by our commitment to quality and transparency. Our platform provides detailed information, professional evaluations, and a secure environment, giving you peace of mind that the property you’re interested in meets our high standards.",
  },
  {
    question: "What happens if a property doesn’t meet the BBR Guarantee standards?",
    answer:
      "BBR uses an expert review process and gathers authentic feedback to verify the accuracy of all property details. Connecting with residences through BBR ensures you’re engaging with verified listings and trustworthy sellers, backed by our commitment to quality and transparency. Our platform provides detailed information, professional evaluations, and a secure environment, giving you peace of mind that the property you’re interested in meets our high standards.",
  },
  {
    question: "Do developers have to pay to be evaluated?",
    answer:
      "BBR uses an expert review process and gathers authentic feedback to verify the accuracy of all property details. Connecting with residences through BBR ensures you’re engaging with verified listings and trustworthy sellers, backed by our commitment to quality and transparency. Our platform provides detailed information, professional evaluations, and a secure environment, giving you peace of mind that the property you’re interested in meets our high standards.",
  },
];

export default function FaqUnit({ themeLight }: { themeLight?: boolean }) {
  return (
    <div className={`${themeLight && "bg-white"}`}>

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
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border shadow-xs hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-9 px-4 py-2 has-[>svg]:px-3 bg-white/5 hover:bg-white/10 text-white border-[#b3804c] w-fit"
            >
              <MessageCircleQuestion absoluteStrokeWidth />
              Contact us
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
    </div>
  );
}