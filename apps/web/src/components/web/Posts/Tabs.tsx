"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button"; 

interface Category {
    id: number;
    name: string;
    slug: string;
}

interface TabsProps {
    categories: Category[];
}

export function Tabs({ categories }: TabsProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentCategorySlug = searchParams.get('category');

    const handleTabClick = (categorySlug: string) => {
        const params = new URLSearchParams(searchParams.toString());
        
        // Remove page parameter when changing categories
        params.delete('page');
        
        if (categorySlug === "") {
            params.delete('category');
        } else {
            params.set('category', categorySlug);
        }
        
        router.push(`/blog${params.toString() ? `?${params.toString()}` : ''}`);
    };

    return (
        <div className="flex gap-2 flex-wrap border-b border-border w-full">
            <a
                className={!currentCategorySlug ? "active-tab" : "classic-tab"}
                onClick={() => handleTabClick("")}
            >
                All
            </a>   
            {categories.map((category) => (
                <a
                    key={category.id}
                    className={currentCategorySlug === category.slug ? "active-tab" : "classic-tab"}
                    onClick={() => handleTabClick(category.slug)}
                >
                    {category.name}
                </a>
            ))}
        </div>
    )
}