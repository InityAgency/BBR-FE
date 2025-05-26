import React, { useEffect, useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Globe, MapPin, Building2, Heart, Tag, Plus, X, Flag } from "lucide-react";
import { API_BASE_URL, API_VERSION } from "@/app/constants/api";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

interface RankingCategoryType {
    id: string;
    name: string;
    key: string;
}

interface RankingCategory {
    id: string;
    name: string;
    slug: string;
}

export default function RankingDirectory() {
    const [openItems, setOpenItems] = useState<string[]>([]);
    const [categoryTypes, setCategoryTypes] = useState<RankingCategoryType[]>([]);
    const [categories, setCategories] = useState<{ [key: string]: RankingCategory[] }>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategoryTypes = async () => {
            try {
                const response = await fetch(
                    `${API_BASE_URL}/api/${API_VERSION}/ranking-category-types?page=1&limit=50`
                );
                const data = await response.json();
                setCategoryTypes(data.data);
                
                // Fetch categories for each type
                data.data.forEach((type: RankingCategoryType) => {
                    fetchCategories(type.id);
                });
            } catch (error) {
                console.error('Error fetching category types:', error);
            } finally {
                setLoading(false);
            }
        };

        const fetchCategories = async (typeId: string) => {
            try {
                const response = await fetch(
                    `${API_BASE_URL}/api/${API_VERSION}/ranking-categories?categoryTypeId=${typeId}&page=1&limit=50`
                );
                const data = await response.json();
                setCategories(prev => ({
                    ...prev,
                    [typeId]: data.data
                }));
            } catch (error) {
                console.error(`Error fetching categories for type ${typeId}:`, error);
            }
        };

        fetchCategoryTypes();
    }, []);

    const getIconForType = (key: string) => {
        switch (key) {
            case 'continents':
                return Globe;
            case 'countries':
                return Flag;
            case 'cities':
                return Building2;
            case 'lifestyles':
                return Heart;
            case 'brands':
                return Tag;
            default:
                return Globe;
        }
    };

    if (loading) {
        return (
            <div className="w-full space-y-4">
                {[...Array(5)].map((_, index) => (
                    <div key={index} className="border rounded-lg p-4">
                        <Skeleton className="h-6 w-48 mb-2" />
                        <Skeleton className="h-4 w-full" />
                    </div>
                ))}
            </div>
        );
    }

    return (
        <Accordion 
            type="single" 
            collapsible 
            className="w-full gap-4 flex flex-col"
            onValueChange={(value) => setOpenItems(value ? [value] : [])}
        >
            {categoryTypes.map((type) => (
                <AccordionItem key={type.id} value={`item-${type.id}`}>
                    <AccordionTrigger className="hover:no-underline [&>svg]:hidden">
                        <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-3">
                                {React.createElement(getIconForType(type.key), { className: "w-5 h-5" })}
                                <span className="text-lg font-medium">{type.name}</span>
                            </div>
                            {openItems.includes(`item-${type.id}`) ? (
                                <X className="h-4 w-4 shrink-0 transition-transform duration-200" />
                            ) : (
                                <Plus className="h-4 w-4 shrink-0 transition-transform duration-200" />
                            )}
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="pl-8 space-y-2 grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-0 gap-x-4 gap-y-0.5 text-md">
                            {categories[type.id]?.map((category) => (
                                <Link 
                                    key={category.id}
                                    href={`/best-residences/${category.slug}`}
                                    className="text-white inline-block hover:text-primary transition-colors"
                                >
                                    {category.name}
                                </Link>
                            ))}
                            {!categories[type.id]?.length && (
                                <p className="text-gray-500">No categories found</p>
                            )}
                        </div>
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    );
}