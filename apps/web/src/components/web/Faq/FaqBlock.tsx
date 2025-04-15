import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import Image from "next/image"
const faqItems = [
    {
        question: "How can connect with your experts?",
        answer: "Connecting with our experts is simple. You can reach out via our contact form, call us directly, or schedule a consultation through our website. Our team is always ready to guide you through your real estate journey with personalized attention."
    },
    {
        question: "Can i have meeting with consultants for my residences?",
        answer: "Get personalized assistance and expert advice from our experienced consultants to make the best decisions for your property needs.Get personalized assistance and expert advice from our experienced consultants to make the best decisions for your property needs.Get personalized assistance and expert advice from our experienced consultants to make the best decisions for your property needs.Get personalized assistance and expert advice from our experienced consultants to make the best decisions for your property needs."
    },
    {
        question: "How do I connect with a luxury real estate expert?",
        answer: "You can connect with a luxury real estate expert by requesting a callback, booking a private consultation online, or visiting one of our regional offices. Our specialists are available to offer tailored insights and help you find the perfect property to match your lifestyle."
    },
    {
        question: "What services does a luxury real estate expert offer?",
        answer: "Our luxury real estate experts provide a comprehensive suite of services including personalized property curation, market analysis, investment advisory, relocation support, and access to exclusive listings. Whether you're buying, selling, or investing, they deliver white-glove service from start to finish."
    },
    {
        question: "What types of luxury residences are available?",
        answer: "We offer a diverse portfolio of luxury residences including beachfront villas, penthouse apartments, designer townhomes, private estates, and high-rise condominiums. Whether you seek serenity, sophistication, or a statement property, there's a perfect home waiting for you."
    }
]

export default function FaqBlock() {
    return (
        <div className="flex flex-col items-center bg-secondary  mx-auto px-4 lg:px-12 py-24 gap-4 xl:gap-8 mb-12 relative">
            <Image src="/bg-pattern.png" alt="FAQ" width={500} height={500} className="absolute top-0 left-0 w-full h-full z-0" />
            <div className="page-header flex flex-col gap-8 max-w-[calc(100svw-1rem)] 2xl:max-w-[90svw] z-3">
                <h2 className="text-4xl font-bold text-left lg:text-center">FAQ</h2>
                <div className="xl:w-[50svw] mx-auto">
                    <Accordion type="single" collapsible defaultValue="0" className="w-full flex flex-col gap-4">
                        {faqItems.map((item, index) => (
                            <AccordionItem key={index} value={`${index}`}>
                                <AccordionTrigger>
                                    <h3 className="text-2xl font-bold">{item.question}</h3>
                                </AccordionTrigger>
                            <AccordionContent>
                                <p className="text-lg text-white/70">{item.answer}</p>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </div>
        </div>
    );
}