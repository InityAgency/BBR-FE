"use client"

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
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

interface RankingCategoryType {
    id: string;
    name: string;
    description?: string;
    createdAt?: string;
    updatedAt?: string;
}

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

export default function RankingCategoriesPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    
    const [rankingCategories, setRankingCategories] = useState<RankingCategory[]>([]);
    const [rankingCategoryTypes, setRankingCategoryTypes] = useState<RankingCategoryType[]>([]);
    const [loading, setLoading] = useState(true);
    const [typesLoading, setTypesLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    
    const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
    const [selectedCategoryTypeIds, setSelectedCategoryTypeIds] = useState<string[]>([]);

    // Get the current page from URL or default to 1
    const pageParam = searchParams.get('page');
    const queryParam = searchParams.get('query');
    const statusParam = searchParams.get('status') || '';
    const categoryTypeIdParam = searchParams.get('categoryTypeId') || '';
    const currentPage = pageParam ? parseInt(pageParam, 10) : 1;

    // Parsiramo status iz URL parametra
    useEffect(() => {
        if (statusParam) {
            const statusArray = statusParam.split(',');
            setSelectedStatuses(statusArray);
        } else {
            setSelectedStatuses([]);
        }
    }, [statusParam]);

    // Parsiramo categoryTypeId iz URL parametra
    useEffect(() => {
        if (categoryTypeIdParam) {
            const categoryTypeIdArray = categoryTypeIdParam.split(',');
            setSelectedCategoryTypeIds(categoryTypeIdArray);
        } else {
            setSelectedCategoryTypeIds([]);
        }
    }, [categoryTypeIdParam]);

    // Učitavamo tipove rankinga sa API-a
    const fetchRankingCategoryTypes = async () => {
        try {
            setTypesLoading(true);
            const url = new URL(`${API_BASE_URL}/api/${API_VERSION}/ranking-category-types`);
            url.searchParams.set('limit', '100'); // Pretpostavljamo da će 100 biti dovoljno za sve tipove
            url.searchParams.set('page', '1');
            
            const response = await fetch(url.toString(), {
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error(`Error fetching ranking category types: ${response.status}`);
            }

            const data: RankingCategoryTypesApiResponse = await response.json();
            setRankingCategoryTypes(data.data || []);
        } catch (error) {
            console.error('Error fetching ranking category types:', error);
            setRankingCategoryTypes([]);
        } finally {
            setTypesLoading(false);
        }
    };

    const fetchRankingCategories = async (page: number, query?: string, statuses?: string[], categoryTypeIds?: string[]) => {
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
            
            // Dodajemo status parametre ako postoje
            if (statuses && statuses.length > 0) {
                urlParams.set('status', statuses.join(','));
            }

            // Dodajemo categoryTypeId parametre ako postoje
            if (categoryTypeIds && categoryTypeIds.length > 0) {
                urlParams.set('categoryTypeId', categoryTypeIds.join(','));
            }
            
            const url = `${API_BASE_URL}/api/${API_VERSION}/ranking-categories?${urlParams.toString()}`;
            
            const response = await fetch(url, {
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

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
            
            // This is important - we're setting these values regardless of page change
            setTotalPages(Math.max(1, data.pagination.totalPages));
            setTotalItems(data.pagination.total);
            
            // Update URL only if the page from API is different
            const apiPage = data.pagination.page || page;
            if (apiPage !== page) {
                updateUrlParams({ page: apiPage });
            }
        } catch (error) {
            console.error("Failed to fetch ranking categories:", error);
            // Don't reset pagination data on error, maintain previous state
            setRankingCategories([]);
        } finally {
            setLoading(false);
        }
    };

    // Update URL with parameters
    const updateUrlParams = (params: { page?: number, statuses?: string[], categoryTypeIds?: string[] }) => {
        const newParams = new URLSearchParams(searchParams.toString());
        
        if (params.page !== undefined) {
            newParams.set('page', params.page.toString());
        }
        
        if (params.statuses !== undefined) {
            if (params.statuses && params.statuses.length > 0) {
                newParams.set('status', params.statuses.join(','));
            } else {
                newParams.delete('status');
            }
        }
        
        if (params.categoryTypeIds !== undefined) {
            if (params.categoryTypeIds && params.categoryTypeIds.length > 0) {
                newParams.set('categoryTypeId', params.categoryTypeIds.join(','));
            } else {
                newParams.delete('categoryTypeId');
            }
        }
        
        // Koristimo replace umesto push da ne dodajemo u history stack
        router.replace(`${pathname}?${newParams.toString()}`);
    };

    // Efekat za učitavanje tipova
    useEffect(() => {
        fetchRankingCategoryTypes();
    }, []);

    // Efekat za ažuriranje URL-a kada se promene statusi
    useEffect(() => {
        updateUrlParams({ statuses: selectedStatuses, page: 1 });
    }, [selectedStatuses]);

    // Efekat za ažuriranje URL-a kada se promene tipovi
    useEffect(() => {
        updateUrlParams({ categoryTypeIds: selectedCategoryTypeIds, page: 1 });
    }, [selectedCategoryTypeIds]);

    // Efekat za učitavanje kategorija
    useEffect(() => {
        if (currentPage >= 1) {
            const statusArray = statusParam ? statusParam.split(',') : [];
            const categoryTypeIdArray = categoryTypeIdParam ? categoryTypeIdParam.split(',') : [];
            fetchRankingCategories(currentPage, queryParam || undefined, statusArray, categoryTypeIdArray);
        }
    }, [currentPage, queryParam, statusParam, categoryTypeIdParam]);

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            updateUrlParams({ page: currentPage + 1 });
        }
    };

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            updateUrlParams({ page: currentPage - 1 });
        }
    };

    const goToPage = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            updateUrlParams({ page });
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
                categoryTypes={rankingCategoryTypes}
                loading={loading || typesLoading}
                totalItems={totalItems}
                totalPages={totalPages}
                currentPage={currentPage}
                goToNextPage={goToNextPage}
                goToPreviousPage={goToPreviousPage}
                goToPage={goToPage}
                fetchCategories={fetchRankingCategories}
                selectedStatuses={selectedStatuses}
                onStatusesChange={setSelectedStatuses}
                selectedCategoryTypeIds={selectedCategoryTypeIds}
                onCategoryTypeIdsChange={setSelectedCategoryTypeIds}
            />
        </AdminLayout>
    );
}