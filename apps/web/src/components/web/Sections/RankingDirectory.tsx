import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Globe, MapPin, Building2, Heart, Tag, Plus, X, Flag } from "lucide-react";
import { useState } from "react";

export default function RankingDirectory() {
    const [openItems, setOpenItems] = useState<string[]>([]);

    const rankingItems = [
        {
            title: "Rankings by Geographical Areas",
            icon: Globe,
            content: "Content for geographical areas rankings"
        },
        {
            title: "Rankings by Country",
            icon: Flag,
            content: "Content for country rankings"
        },
        {
            title: "Rankings by City",
            icon: Building2,
            content: "Content for city rankings"
        },
        {
            title: "Rankings by Lifestyle",
            icon: Heart,
            content: "Content for lifestyle rankings"
        },
        {
            title: "Rankings by Brands",
            icon: Tag,
            content: "Content for brand rankings"
        }
    ];

    return (

            <Accordion 
                type="single" 
                collapsible 
                className="w-full gap-4 flex flex-col"
                onValueChange={(value) => setOpenItems(value ? [value] : [])}
            >
                {rankingItems.map((item, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger className="hover:no-underline [&>svg]:hidden">
                            <div className="flex items-center justify-between w-full">
                                <div className="flex items-center gap-3">
                                    <item.icon className="w-5 h-5" />
                                    <span className="text-lg font-medium">{item.title}</span>
                                </div>
                                {openItems.includes(`item-${index}`) ? (
                                    <X className="h-4 w-4 shrink-0 transition-transform duration-200" />
                                ) : (
                                    <Plus className="h-4 w-4 shrink-0 transition-transform duration-200" />
                                )}
                            </div>
                        </AccordionTrigger>
                        <AccordionContent>
                            <div className="pl-8 text-gray-600">
                                {item.content}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
    );
}