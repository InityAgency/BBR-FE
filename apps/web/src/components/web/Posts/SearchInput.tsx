"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState, useEffect } from "react";

export function SearchInput() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

    // Use debounce to prevent too many API calls
    useEffect(() => {
        const timer = setTimeout(() => {
            const params = new URLSearchParams(searchParams.toString());
            
            if (searchQuery.trim()) {
                params.set('search', searchQuery.trim());
                params.delete('page'); // Reset pagination when searching
                params.delete('category'); // Remove category when searching
            } else {
                params.delete('search');
            }
            
            router.push(`/blog${params.toString() ? `?${params.toString()}` : ''}`);
        }, 300); // 300ms delay

        return () => clearTimeout(timer);
    }, [searchQuery, router, searchParams]);

    return (
        <div className="relative w-full max-w-md">
            <Input
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-6 text-lg"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        </div>
    );
} 