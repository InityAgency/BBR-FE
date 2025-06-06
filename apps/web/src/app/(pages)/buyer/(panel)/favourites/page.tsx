"use client";

import { useEffect, useState, useCallback } from "react";
import { ResidenceCard } from "@/components/web/Residences/ResidenceCard";
import { ResidenceCardSkeleton } from "@/components/web/Residences/ResidenceCardSkeleton";
import type { Residence } from "@/types/residence";
import { Pagination } from "@/components/common/Pagination";

export default function Favourites() {
    const [residences, setResidences] = useState<Residence[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchFavorites = useCallback(async (page: number) => {
        try {
            setLoading(true);
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/${process.env.NEXT_PUBLIC_API_VERSION}/favorites?page=${page}&limit=12`,
                {
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (!response.ok) {
                throw new Error('Failed to fetch favorites');
            }

            const data = await response.json();
            // Mapirajmo favorite na rezidencije
            const mappedResidences = data.data.map((favorite: any) => favorite.entity);
            setResidences(mappedResidences || []);
            setTotalPages(data.pagination.totalPages);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchFavorites(currentPage);
    }, [fetchFavorites, currentPage]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div className="space-y-6 w-full py-8 pt-0 lg:pt-8">
            <div>
                <h1 className="text-2xl text-sans font-bold text-left">My Favorites</h1>
                <p className="text-muted-foreground mt-2">
                    Browse through your favorite residences
                </p>
            </div>

            <div className="w-full mt-8">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, index) => (
                            <ResidenceCardSkeleton key={index} />
                        ))}
                    </div>
                ) : error ? (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">Failed to load favorites. Please try again later.</p>
                    </div>
                ) : residences.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {residences.map((residence) => (
                                <ResidenceCard 
                                    key={residence.id} 
                                    residence={residence}
                                    isFavorite={true}
                                    onFavoriteRemoved={() => fetchFavorites(currentPage)}
                                />
                            ))}
                        </div>
                        {totalPages > 1 && (
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        )}
                    </>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">No favorite residences found.</p>
                    </div>
                )}
            </div>
        </div>
    );
}   