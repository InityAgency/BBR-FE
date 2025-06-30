"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

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
    const tabsRef = useRef<HTMLDivElement>(null);

    // Scroll to tabs when category is selected
    useEffect(() => {
        if (currentCategorySlug && tabsRef.current) {
            // Koristimo requestAnimationFrame da osiguramo da je DOM ažuriran
            requestAnimationFrame(() => {
                tabsRef.current?.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start',
                    inline: 'nearest'
                });
            });
        }
    }, [currentCategorySlug]);

    const handleTabClick = (categorySlug: string) => {
        const params = new URLSearchParams(searchParams.toString());
        
        // Remove page parameter when changing categories
        params.delete('page');
        
        if (categorySlug === "") {
            params.delete('category');
        } else {
            params.set('category', categorySlug);
        }
        
        const newUrl = `/blog${params.toString() ? `?${params.toString()}` : ''}`;
        
        // Use replace with scroll: false to prevent automatic scroll to top
        router.replace(newUrl, { scroll: false });
    };

    return (
        <div ref={tabsRef} className="flex gap-2 flex-wrap border-b border-border w-full">
            <button
                className={!currentCategorySlug ? "active-tab" : "classic-tab"}
                onClick={() => handleTabClick("")}
                type="button"
            >
                All
            </button>   
            {categories.map((category) => (
                <button
                    key={category.id}
                    className={currentCategorySlug === category.slug ? "active-tab" : "classic-tab"}
                    onClick={() => handleTabClick(category.slug)}
                    type="button"
                >
                    {category.name}
                </button>
            ))}
        </div>
    )
}