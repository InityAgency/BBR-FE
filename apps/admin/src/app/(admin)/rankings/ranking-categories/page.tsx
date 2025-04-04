"use client"

import React, { useState, useEffect, useCallback } from "react";
import AdminLayout from "../../AdminLayout";
import PageHeader from "@/components/admin/Headers/PageHeader";
import { API_BASE_URL, API_VERSION } from "@/app/constants/api";
import { RankingCategory } from "@/app/types/models/RankingCategory";
import { RankingCategoryTable } from "@/components/admin/RankingCategory/Table/RankingCategoryTable";

const ITEMS_PER_PAGE = 10;

interface RankingCategoryApiResponse {
    data: RankingCategory[];
    statusCode: number;
    message: string;
    pagination: {
        total: number;
        totalPages: number;
        page: number;
        limit: number;
    };
    timestamp: string;
    path: string;
}

export default function RankingCategoriesPage() {
    const [rankingCategories, setRankingCategories] = useState<RankingCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    const fetchRankingCategories = useCallback(async (page?: number, query?: string) => {
        setLoading(true);
        const pageToFetch = page !== undefined ? page : currentPage;
        const queryParam = query ? `&query=${encodeURIComponent(query)}` : '';

        try {
            const response = await fetch(
                `${API_BASE_URL}/api/${API_VERSION}/ranking-categories?limit=${ITEMS_PER_PAGE}&page=${pageToFetch}${queryParam}`,
                {
                    credentials: 'include',
                    cache: 'no-store',
                    headers: {
                        'Content-Type': 'application/json',
                        'Cache-Control': 'no-cache, no-store, must-revalidate'
                    }
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Error fetching ranking categories: ${response.status}`);
            }

            const data: RankingCategoryApiResponse = await response.json();

            // Validate pagination data
            const validTotal = typeof data.pagination.total === 'number' && data.pagination.total >= 0;
            const validTotalPages = typeof data.pagination.totalPages === 'number' && data.pagination.totalPages >= 0;
            
            if (!validTotal || !validTotalPages) {
                throw new Error('Invalid pagination data received from server');
            }

            setRankingCategories(data.data || []);
            
            const calculatedTotalPages = Math.max(1, data.pagination.totalPages);
            setTotalPages(calculatedTotalPages);
            setTotalItems(data.pagination.total);

            // If we received page 0 (which would be strange), set to 1
            const receivedPage = Math.max(1, data.pagination.page || pageToFetch);  
            
            // If we're on a page that doesn't exist (after deleting the last element of a page), set to the last page
            if (receivedPage > calculatedTotalPages && calculatedTotalPages > 0) {
                setCurrentPage(calculatedTotalPages);
            } else {
                setCurrentPage(receivedPage);
            }
        } catch (error) {
            console.error('Error fetching ranking categories:', error);
        } finally {
            setLoading(false);
        }
    }, [currentPage]);

    const refetchData = useCallback(() => {
        fetchRankingCategories();
    }, [fetchRankingCategories]);

    useEffect(() => {
        fetchRankingCategories(currentPage);
    }, [fetchRankingCategories, currentPage]);

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prev => prev + 1);
        }
    };

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1);
        }
    };

    const goToPage = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <AdminLayout>
            <PageHeader 
                title="Ranking Categories" 
                count={totalItems}
                buttonText="Add new ranking category"
                buttonUrl="/rankings/ranking-categories/create"
            />

            <RankingCategoryTable
                categories={rankingCategories}
                loading={loading}
                totalItems={totalItems}
                totalPages={totalPages}
                currentPage={currentPage}
                goToNextPage={goToNextPage}
                goToPreviousPage={goToPreviousPage}
                goToPage={goToPage}
                fetchCategories={fetchRankingCategories}
            />
        </AdminLayout>
    );
}