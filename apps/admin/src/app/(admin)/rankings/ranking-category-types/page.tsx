"use client"

import React, { useState, useEffect, useCallback } from "react";
import AdminLayout from "../../AdminLayout";
import PageHeader from "@/components/admin/Headers/PageHeader";
import { RankingCategoryType } from "@/app/types/models/RankingCategoryType";
import { API_BASE_URL, API_VERSION } from "@/app/constants/api";
import { RankingCategoryTypesTable } from "@/components/admin/RankingCategoryTypes/Table/RankingCategoryTypesTable";

const ITEMS_PER_PAGE = 10;

interface RankingCategoryTypesApiResponse {
    data: RankingCategoryType[];
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

export default function RankingCategoryTypesPage() {
    const [rankingCategoryTypes, setRankingCategoryTypes] = useState<RankingCategoryType[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    const fetchRankingCategoryTypes = useCallback(async (page?: number, query?: string) => {
        setLoading(true);
        const pageToFetch = page !== undefined ? page : currentPage;
        const queryParam = query ? `&query=${encodeURIComponent(query)}` : '';

        try {
            const response = await fetch(
                `${API_BASE_URL}/api/${API_VERSION}/ranking-category-types?limit=${ITEMS_PER_PAGE}&page=${pageToFetch}${queryParam}`,
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
                throw new Error(`Error fetching ranking category types: ${response.status}`);
            }

            const data: RankingCategoryTypesApiResponse = await response.json();

            // Validate pagination data
            const validTotal = typeof data.pagination.total === 'number' && data.pagination.total >= 0;
            const validTotalPages = typeof data.pagination.totalPages === 'number' && data.pagination.totalPages >= 0;
            
            if (!validTotal || !validTotalPages) {
                throw new Error('Invalid pagination data received from server');
            }

            setRankingCategoryTypes(data.data || []);
            
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
        } catch (err: any) {
            console.error("Error fetching ranking category types:", err);
        } finally {
            setLoading(false);
        }
    }, [currentPage]);

    const refetchData = useCallback(() => {
        fetchRankingCategoryTypes();
    }, [fetchRankingCategoryTypes]);

    useEffect(() => {
        fetchRankingCategoryTypes(currentPage);
    }, [fetchRankingCategoryTypes, currentPage]);

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
                title="Ranking Category Types"
                count={totalItems}
                buttonText="Add new ranking category type"
                buttonUrl="/rankings/ranking-category-types/create"
            />

            <RankingCategoryTypesTable
                rankingCategoryTypes={rankingCategoryTypes}
                loading={loading}
                totalItems={totalItems}
                totalPages={totalPages}
                currentPage={currentPage}
                goToNextPage={goToNextPage}
                goToPreviousPage={goToPreviousPage}
                goToPage={goToPage}
                fetchRankingCategoryTypes={fetchRankingCategoryTypes}
            />
        </AdminLayout>
    )
}