"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { ReviewsTable } from "@/components/web/Reviews/Table/ReviewsTable";
import { API_BASE_URL, API_VERSION } from "@/app/constants/api";
import { Badge } from "@/components/ui/badge";
import { Review, ReviewsResponse } from "@/types/review";

const ITEMS_PER_PAGE = 10;

export default function DeveloperReviews() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [error, setError] = useState<string | null>(null);
    
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const fetchReviews = async (page: number) => {
        try {
            setLoading(true);
            setError(null);
            
            const url = `${API_BASE_URL}/api/${API_VERSION}/reviews?page=${page}&limit=${ITEMS_PER_PAGE}`;
            
            const response = await fetch(url, {
                credentials: "include"
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data: ReviewsResponse = await response.json();

            setReviews(data.data || []);
            setTotalItems(data.pagination?.total || 0);
            setTotalPages(data.pagination?.totalPages || 1);
            setCurrentPage(data.pagination?.page || 1);
        } catch (error) {
            console.error('Fetch error:', error);
            setError("An error occurred while loading reviews.");
            setReviews([]);
            setTotalItems(0);
            setTotalPages(1);
            setCurrentPage(1);
        } finally {
            setLoading(false);
        }
    };

    const updateUrlParams = (params: {
        page?: number;
    }) => {
        const urlParams = new URLSearchParams(searchParams);
        
        if (params.page !== undefined) {
            urlParams.set("page", params.page.toString());
        }
        
        router.push(`${pathname}?${urlParams.toString()}`);
    };

    useEffect(() => {
        const page = Number(searchParams.get("page")) || 1;
        fetchReviews(page);
    }, [searchParams]);

    const goToPage = (page: number) => {
        updateUrlParams({ page });
    };

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            goToPage(currentPage + 1);
        }
    };

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            goToPage(currentPage - 1);
        }
    };

    return (
        <div className="flex flex-col gap-4 py-8">
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <h1 className="text-xl font-bold sm:text-2xl text-sans">Reviews</h1>
                        <Badge variant="outline" className="self-start sm:self-auto px-2 py-1 text-sm">
                            {totalItems} {totalItems === 1 ? 'review' : 'reviews'}
                        </Badge>
                    </div>
                </div>
            </div>
            
            {error && (
                <div className="text-red-500 font-semibold border border-red-200 bg-red-50 p-4 rounded-md">
                    {error}
                </div>
            )}
            
            <ReviewsTable
                reviews={reviews}
                loading={loading}
                totalItems={totalItems}
                totalPages={totalPages}
                currentPage={currentPage}
                goToNextPage={goToNextPage}
                goToPreviousPage={goToPreviousPage}
                goToPage={goToPage}
            />
        </div>
    );
}