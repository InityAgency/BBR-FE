import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "../../../components/ui/accordion"
import { MessageCircleQuestion, Search, CheckCircle2, FileText, Bell } from "lucide-react"
import Link from "next/link"
import SectionLayout from "../SectionLayout"

const faqItems = {
    general: [
      {
        question: "Search - Why should I connect with the residence from here?",
        answer: "Connecting with residences through BBR ensures you’re engaging with verified listings and trustworthy sellers, backed by our commitment to quality and transparency. Our platform provides detailed information, professional evaluations, and a secure environment, giving you peace of mind that the property you’re interested in meets our high standards."
      },
      {
        question: "What is the BBR Guarantee?",
        answer: "Connecting with residences through BBR ensures you’re engaging with verified listings and trustworthy sellers, backed by our commitment to quality and transparency. Our platform provides detailed information, professional evaluations, and a secure environment, giving you peace of mind that the property you’re interested in meets our high standards."
      },
      {
          question: "Guarantee - Why should I connect with the residence from here?",
          answer: "Connecting with residences through BBR ensures you’re engaging with verified listings and trustworthy sellers, backed by our commitment to quality and transparency. Our platform provides detailed information, professional evaluations, and a secure environment, giving you peace of mind that the property you’re interested in meets our high standards."
      },
      {
          question: "Deal term - Why should I connect with the residence from here?",
          answer: "Connecting with residences through BBR ensures you’re engaging with verified listings and trustworthy sellers, backed by our commitment to quality and transparency. Our platform provides detailed information, professional evaluations, and a secure environment, giving you peace of mind that the property you’re interested in meets our high standards."
      },
      {
          question: "Alerts - Why should I connect with the residence from here?",
          answer: "Connecting with residences through BBR ensures you’re engaging with verified listings and trustworthy sellers, backed by our commitment to quality and transparency. Our platform provides detailed information, professional evaluations, and a secure environment, giving you peace of mind that the property you’re interested in meets our high standards."
      },
      {
        question: "How does the BBR Guarantee protect me as a buyer?",
        answer: "Connecting with residences through BBR ensures you’re engaging with verified listings and trustworthy sellers, backed by our commitment to quality and transparency. Our platform provides detailed information, professional evaluations, and a secure environment, giving you peace of mind that the property you’re interested in meets our high standards."
      },
      {
        question: "What happens if a property doesn’t meet the BBR Guarantee standards?",
        answer: "Connecting with residences through BBR ensures you’re engaging with verified listings and trustworthy sellers, backed by our commitment to quality and transparency. Our platform provides detailed information, professional evaluations, and a secure environment, giving you peace of mind that the property you’re interested in meets our high standards."
      }
    ],
    search: [
        {
            question: "Search - Why should I connect with the residence from here?",
            answer: "Connecting with residences through BBR ensures you’re engaging with verified listings and trustworthy sellers, backed by our commitment to quality and transparency. Our platform provides detailed information, professional evaluations, and a secure environment, giving you peace of mind that the property you’re interested in meets our high standards."
        },
        {
            question: "What is the BBR Guarantee?", 
            answer: "Connecting with residences through BBR ensures you’re engaging with verified listings and trustworthy sellers, backed by our commitment to quality and transparency. Our platform provides detailed information, professional evaluations, and a secure environment, giving you peace of mind that the property you’re interested in meets our high standards."
        },
        {
            question: "How does the BBR Guarantee protect me as a buyer?",
            answer: "Connecting with residences through BBR ensures you’re engaging with verified listings and trustworthy sellers, backed by our commitment to quality and transparency. Our platform provides detailed information, professional evaluations, and a secure environment, giving you peace of mind that the property you’re interested in meets our high standards."
        },
        {
            question: "What happens if a property doesn’t meet the BBR Guarantee standards?", 
            answer: "Connecting with residences through BBR ensures you’re engaging with verified listings and trustworthy sellers, backed by our commitment to quality and transparency. Our platform provides detailed information, professional evaluations, and a secure environment, giving you peace of mind that the property you’re interested in meets our high standards."
        }
    ],
    guarantee: [
        {
            question: "Guarantee - Why should I connect with the residence from here?",
            answer: "Connecting with residences through BBR ensures you’re engaging with verified listings and trustworthy sellers, backed by our commitment to quality and transparency. Our platform provides detailed information, professional evaluations, and a secure environment, giving you peace of mind that the property you’re interested in meets our high standards."
        },
        {
            question: "What is the BBR Guarantee?",
            answer: "Connecting with residences through BBR ensures you’re engaging with verified listings and trustworthy sellers, backed by our commitment to quality and transparency. Our platform provides detailed information, professional evaluations, and a secure environment, giving you peace of mind that the property you’re interested in meets our high standards."
        },
        {
            question: "How does the BBR Guarantee protect me as a buyer?",
            answer: "Connecting with residences through BBR ensures you’re engaging with verified listings and trustworthy sellers, backed by our commitment to quality and transparency. Our platform provides detailed information, professional evaluations, and a secure environment, giving you peace of mind that the property you’re interested in meets our high standards."
        },
        {
            question: "What happens if a property doesn’t meet the BBR Guarantee standards?",
            answer: "Connecting with residences through BBR ensures you’re engaging with verified listings and trustworthy sellers, backed by our commitment to quality and transparency. Our platform provides detailed information, professional evaluations, and a secure environment, giving you peace of mind that the property you’re interested in meets our high standards."
        },
    ],
    deal: [
        {
            question: "Deal term - Why should I connect with the residence from here?",
            answer: "Connecting with residences through BBR ensures you’re engaging with verified listings and trustworthy sellers, backed by our commitment to quality and transparency. Our platform provides detailed information, professional evaluations, and a secure environment, giving you peace of mind that the property you’re interested in meets our high standards."
        },
        {
            question: "What is the BBR Guarantee?",
            answer: "Connecting with residences through BBR ensures you’re engaging with verified listings and trustworthy sellers, backed by our commitment to quality and transparency. Our platform provides detailed information, professional evaluations, and a secure environment, giving you peace of mind that the property you’re interested in meets our high standards."
        },
        {
            question: "How does the BBR Guarantee protect me as a buyer?",
            answer: "Connecting with residences through BBR ensures you’re engaging with verified listings and trustworthy sellers, backed by our commitment to quality and transparency. Our platform provides detailed information, professional evaluations, and a secure environment, giving you peace of mind that the property you’re interested in meets our high standards."
        },
        {
            question: "What happens if a property doesn’t meet the BBR Guarantee standards?",
            answer: "Connecting with residences through BBR ensures you’re engaging with verified listings and trustworthy sellers, backed by our commitment to quality and transparency. Our platform provides detailed information, professional evaluations, and a secure environment, giving you peace of mind that the property you’re interested in meets our high standards."
        },
    ],
    alerts: [
        {
            question: "Alerts - Why should I connect with the residence from here?",
            answer: "Connecting with residences through BBR ensures you’re engaging with verified listings and trustworthy sellers, backed by our commitment to quality and transparency. Our platform provides detailed information, professional evaluations, and a secure environment, giving you peace of mind that the property you’re interested in meets our high standards."
        },
        {
          question: "What is the BBR Guarantee?",
          answer: "Connecting with residences through BBR ensures you’re engaging with verified listings and trustworthy sellers, backed by our commitment to quality and transparency. Our platform provides detailed information, professional evaluations, and a secure environment, giving you peace of mind that the property you’re interested in meets our high standards."
        },
        {
          question: "How does the BBR Guarantee protect me as a buyer?",
          answer: "Connecting with residences through BBR ensures you’re engaging with verified listings and trustworthy sellers, backed by our commitment to quality and transparency. Our platform provides detailed information, professional evaluations, and a secure environment, giving you peace of mind that the property you’re interested in meets our high standards."
        },
        {
          question: "What happens if a property doesn’t meet the BBR Guarantee standards?",
          answer: "Connecting with residences through BBR ensures you’re engaging with verified listings and trustworthy sellers, backed by our commitment to quality and transparency. Our platform provides detailed information, professional evaluations, and a secure environment, giving you peace of mind that the property you’re interested in meets our high standards."
        }
      
    ]
}

export default function FaqTabs() {
    return (
      <div className="w-full">
          <Tabs defaultValue="general" className="w-full">
              <TabsList className="custom-tablist">
                  <TabsTrigger 
                      value="general" 
                      className="flex items-center gap-2 bg-transparent border-none data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary text-md custom-tabs"
                  >
                      <MessageCircleQuestion className="w-5 h-5" />
                      All Questions
                  </TabsTrigger>
                  <TabsTrigger 
                      value="search" 
                      className="flex items-center gap-2 bg-transparent border-none data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary text-md custom-tabs"
                  >
                      <Search className="w-5 h-5" />
                      Starting Your Search
                  </TabsTrigger>
                  <TabsTrigger 
                      value="guarantee" 
                      className="flex items-center gap-2 bg-transparent border-none data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary text-md custom-tabs"
                  >
                      <CheckCircle2 className="w-5 h-5" />
                      BBR Guarantee
                  </TabsTrigger>
                  <TabsTrigger 
                      value="deal" 
                      className="flex items-center gap-2 bg-transparent border-none data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary text-md custom-tabs"
                  >
                      <FileText className="w-5 h-5" />
                      Making a Deal
                  </TabsTrigger>
                  <TabsTrigger 
                      value="alerts" 
                      className="flex items-center gap-2 bg-transparent border-none data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary text-md custom-tabs"
                  >
                      <Bell className="w-5 h-5" />
                      Setting Up Alerts
                  </TabsTrigger>
              </TabsList>
              <TabsContent value="general">
                  <Accordion type="single" collapsible className="w-full">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {faqItems.general.map((item, index) => (
                              <AccordionItem key={index} value={`${index}`} className="border h-fit">
                                  <AccordionTrigger className="hover:no-underline">
                                      <h3 className="text-xl font-medium faq-title">{item.question}</h3>
                                  </AccordionTrigger>
                                  <AccordionContent className="text-lg text-regular text-white/70">
                                      {item.answer}
                                  </AccordionContent>
                              </AccordionItem>
                          ))}
                      </div>
                  </Accordion>
              </TabsContent>
              <TabsContent value="search">
                  <Accordion type="single" collapsible className="w-full">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {faqItems.search.map((item, index) => (
                              <AccordionItem key={index} value={`${index}`} className="border h-fit">
                                  <AccordionTrigger className="hover:no-underline">
                                      <h3 className="text-xl font-medium faq-title">{item.question}</h3>
                                  </AccordionTrigger>
                                  <AccordionContent className="text-lg text-regular text-white/70">
                                      {item.answer}
                                  </AccordionContent>
                              </AccordionItem>
                          ))}
                      </div>
                  </Accordion>
              </TabsContent>
              <TabsContent value="guarantee">
                  <Accordion type="single" collapsible className="w-full">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {faqItems.guarantee.map((item, index) => (
                              <AccordionItem key={index} value={`${index}`} className="border h-fit">
                                  <AccordionTrigger className="hover:no-underline">
                                      <h3 className="text-xl font-medium faq-title">{item.question}</h3>
                                  </AccordionTrigger>
                                  <AccordionContent className="text-lg text-regular text-white/70">
                                      {item.answer}
                                  </AccordionContent>
                              </AccordionItem>
                          ))}
                      </div>
                  </Accordion>
              </TabsContent>
              <TabsContent value="deal">
                  <Accordion type="single" collapsible className="w-full">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {faqItems.deal.map((item, index) => (
                              <AccordionItem key={index} value={`${index}`} className="border h-fit">
                                  <AccordionTrigger className="hover:no-underline">
                                      <h3 className="text-xl font-medium faq-title">{item.question}</h3>
                                  </AccordionTrigger>
                                  <AccordionContent className="text-lg text-regular text-white/70">
                                      {item.answer}
                                  </AccordionContent>
                              </AccordionItem>
                          ))}
                      </div>
                  </Accordion>
              </TabsContent>
              <TabsContent value="alerts">
                  <Accordion type="single" collapsible className="w-full">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {faqItems.alerts.map((item, index) => (
                              <AccordionItem key={index} value={`${index}`} className="border h-fit">
                                  <AccordionTrigger className="hover:no-underline">
                                      <h3 className="text-xl font-medium faq-title">{item.question}</h3>
                                  </AccordionTrigger>
                                  <AccordionContent className="text-lg text-regular text-white/70">
                                      {item.answer}
                                  </AccordionContent>
                              </AccordionItem>
                          ))}
                      </div>
                  </Accordion>
              </TabsContent>
          </Tabs>
      </div>
    );
} 