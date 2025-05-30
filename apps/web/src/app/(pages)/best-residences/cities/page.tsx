'use client';
import { ReactNode, useEffect, useState, useCallback } from "react";
import SectionLayout from "@/components/web/SectionLayout";
import RankingCard from "@/components/web/Ranking/RankingCard";
import { Pagination } from "@/components/common/Pagination";
import React from "react";

// Skeleton component
const Skeleton = ({ className }: { className?: string }) => (
    <div className={`animate-pulse bg-secondary/10 rounded-md ${className}`} />
);

interface RankingCategory {
    id: string;
    name: string;
    title: string;
    slug: string;
    residenceLimitation: number;
    featuredImage: {
        id: string;
    };
    categoryTypeId: string;
}

interface PaginationData {
    total: number;
    totalPages: number;
    page: number;
    limit: number;
}

interface CategoriesResponse {
    data: RankingCategory[];
    pagination: PaginationData;
}

export default function CitiesPage() {
    const [data, setData] = useState<RankingCategory[]>([]);
    const [pagination, setPagination] = useState<PaginationData>({
        total: 0,
        totalPages: 0,
        page: 1,
        limit: 24
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const apiVersion = process.env.NEXT_PUBLIC_API_VERSION;
    const categoryTypeId = '9f24a349-c942-43b4-8488-88d57aee65be'; // Cities ID

    // Fetch cities data
    const fetchData = useCallback(async (page: number) => {
        if (!baseUrl || !apiVersion) return;

        try {
            setLoading(true);
            setError(null);

            const url = `${baseUrl}/api/${apiVersion}/public/ranking-categories?page=${page}&limit=${pagination.limit}&categoryTypeId=${categoryTypeId}`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Failed to fetch cities: ${response.status}`);
            }

            const result: CategoriesResponse = await response.json();
            
            setData(result.data || []);
            setPagination(result.pagination);
        } catch (err) {
            console.error('Error fetching cities:', err);
            setError(err instanceof Error ? err.message : 'Unknown error occurred');
        } finally {
            setLoading(false);
        }
    }, [baseUrl, apiVersion, categoryTypeId, pagination.limit]);

    // Initial load
    useEffect(() => {
        fetchData(1);
    }, []);

    // Handle page change
    const handlePageChange = (newPage: number) => {
        setPagination(prev => ({ ...prev, page: newPage }));
        fetchData(newPage);
    };

    // Card Skeleton Component
    const CardSkeleton = () => (
        <div className="rounded-xl overflow-hidden shadow-sm">
            <Skeleton className="w-full h-[200px] bg-secondary/50" />
            <div className="p-4 space-y-2">
                <Skeleton className="h-6 w-3/4 bg-secondary/50" />
                <Skeleton className="h-4 w-full bg-secondary/50" />
                <Skeleton className="h-4 w-2/3 bg-secondary/50" />
            </div>
        </div>
    );

    // Loading state
    if (loading && pagination.page === 1) {
        return (
            <div>
                {/* Header Skeleton */}
                <div className="flex flex-col items-center rounded-b-xl bg-secondary max-w-[calc(100svw-1.5rem)] 2xl:max-w-[calc(100svw-4rem)] mx-auto px-4 lg:px-12 py-12 gap-4 xl:gap-12 mb-12">
                    <div className="w-full xl:max-w-[1600px] mx-auto">
                        <div className="page-header flex flex-col gap-6 w-full lg:w-1/2 mx-auto ms-0">
                            <Skeleton className="h-4 w-48 bg-white/10" />
                            <Skeleton className="h-12 w-3/4 bg-white/10" />
                        </div>
                    </div>
                </div>

                {/* Content Skeleton */}
                <SectionLayout>
                    <div className="w-full xl:max-w-[1600px] mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 w-full">
                            {Array.from({ length: 16 }, (_, i) => (
                                <CardSkeleton key={i} />
                            ))}
                        </div>
                    </div>
                </SectionLayout>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div>
                <div className="flex flex-col items-center rounded-b-xl bg-secondary max-w-[calc(100svw-1.5rem)] 2xl:max-w-[calc(100svw-4rem)] mx-auto px-4 lg:px-12 py-12 gap-4 xl:gap-12 mb-12">
                    <div className="w-full xl:max-w-[1600px] mx-auto">
                        <div className="page-header flex flex-col gap-6 w-full lg:w-1/2 mx-auto ms-0">
                            <p className="text-md uppercase text-left text-primary">URBAN LUXURY DESTINATIONS</p>
                            <h1 className="text-4xl font-bold text-left">Best Branded Residences by Cities</h1>
                        </div>
                    </div>
                </div>
                <SectionLayout>
                    <div className="flex justify-center items-center min-h-[400px]">
                        <div className="text-xl text-red-500">Error: {error}</div>
                    </div>
                </SectionLayout>
            </div>
        );
    }

    return (
        <div>
            {/* Header Section */}
            <div className="flex flex-col items-center rounded-b-xl bg-secondary max-w-[calc(100svw-1.5rem)] 2xl:max-w-[calc(100svw-4rem)] mx-auto px-4 lg:px-12 py-12 gap-4 xl:gap-12 mb-12">
                <div className="w-full xl:max-w-[1600px] mx-auto">
                    <div className="page-header flex flex-col gap-6 w-full lg:w-1/2 mx-auto ms-0">
                        <p className="text-md uppercase text-left text-primary">URBAN LUXURY DESTINATIONS</p>
                        <h1 className="text-4xl font-bold text-left">
                            Best Branded Residences by Cities
                        </h1>
                        <p className="text-lg text-white/80">
                            Explore premium branded residences in major cities globally and find your perfect urban luxury living destination.
                        </p>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <SectionLayout>
                <div className="w-full xl:max-w-[1600px] mx-auto">
                    {data.length === 0 && !loading ? (
                        <div className="text-center text-white text-xl py-12">
                            No cities found.
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full">
                                {data.map((category) => (
                                    <RankingCard
                                        key={category.id}
                                        category={category}
                                        baseUrl={baseUrl!}
                                        apiVersion={apiVersion!}
                                    />
                                ))}
                            </div>

                            {/* Pagination */}
                            {pagination.totalPages > 1 && (
                                <Pagination
                                    currentPage={pagination.page}
                                    totalPages={pagination.totalPages}
                                    onPageChange={handlePageChange}
                                />
                            )}
                        </>
                    )}
                </div>
            </SectionLayout>
        </div>
    );
}