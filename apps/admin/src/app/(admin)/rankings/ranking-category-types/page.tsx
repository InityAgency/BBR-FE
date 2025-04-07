"use client"

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
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
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const [rankingCategoryTypes, setRankingCategoryTypes] = useState<RankingCategoryType[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    // Get the current page from URL or default to 1
    const pageParam = searchParams.get('page');
    const queryParam = searchParams.get('query');
    const currentPage = pageParam ? parseInt(pageParam, 10) : 1;

    const fetchRankingCategoryTypes = async (page: number, query?: string) => {
        setLoading(true);
        try {
            // Kreiramo URL parametre
            const urlParams = new URLSearchParams();
            urlParams.set('limit', ITEMS_PER_PAGE.toString());
            urlParams.set('page', page.toString());
            
            // Dodajemo query parametar ako postoji
            if (query && query.trim() !== '') {
                urlParams.set('query', query);
            }
            
            const url = `${API_BASE_URL}/api/${API_VERSION}/ranking-category-types?${urlParams.toString()}`;
            
            const response = await fetch(url, {
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

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
            
            // This is important - we're setting these values regardless of page change
            setTotalPages(Math.max(1, data.pagination.totalPages));
            setTotalItems(data.pagination.total);
            
            // Update URL only if the page from API is different
            const apiPage = data.pagination.page || page;
            if (apiPage !== page) {
                updateUrlWithPage(apiPage, query);
            }
        } catch (error) {
            console.error("Failed to fetch ranking category types:", error);
            // Don't reset pagination data on error, maintain previous state
            setRankingCategoryTypes([]);
        } finally {
            setLoading(false);
        }
    };

    // Update URL with the current page and query
    const updateUrlWithPage = (page: number, query?: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', page.toString());
        
        if (query && query.trim() !== '') {
            params.set('query', query);
        } else {
            // Uklanjamo query parametar ako ne postoji ili je prazan string
            params.delete('query');
        }
        
        // Koristimo replace umesto push da ne dodajemo u history stack
        router.replace(`${pathname}?${params.toString()}`);
    };

    useEffect(() => {
        if (currentPage >= 1) {
            fetchRankingCategoryTypes(currentPage, queryParam || undefined);
        }
    }, [currentPage, queryParam]); // Re-fetch when currentPage or queryParam changes

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            updateUrlWithPage(currentPage + 1, queryParam || undefined);
        }
    };

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            updateUrlWithPage(currentPage - 1, queryParam || undefined);
        }
    };

    const goToPage = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            updateUrlWithPage(page, queryParam || undefined);
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
    );
}