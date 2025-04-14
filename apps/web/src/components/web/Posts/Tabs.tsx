"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button"; 

interface Category {
    id: number;
    name: string;
}

interface TabsProps {
    categories: Category[];
}

export function Tabs({ categories }: TabsProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentCategoryId = searchParams.get('category');

    const handleTabClick = (categoryId: string) => {
        const params = new URLSearchParams(searchParams.toString());
        
        // Remove page parameter when changing categories
        params.delete('page');
        
        if (categoryId === "") {
            params.delete('category');
        } else {
            params.set('category', categoryId);
        }
        
        router.push(`/blog${params.toString() ? `?${params.toString()}` : ''}`);
    };

    return (
        <div className="flex gap-2 flex-wrap border-b border-border ">
            <a
                className={!currentCategoryId ? "active-tab" : "classic-tab"}
                onClick={() => handleTabClick("")}
            >
                All
            </a>   
            {categories.map((category) => (
                <a
                    key={category.id}
                    className={currentCategoryId === category.id.toString() ? "active-tab" : "classic-tab"}
                    onClick={() => handleTabClick(category.id.toString())}
                >
                    {category.name}
                </a>
            ))}
        </div>
    )
}