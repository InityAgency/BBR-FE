// app/admin/brands/page.tsx
"use client"

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import AdminLayout from "../AdminLayout";
import PageHeader from "@/components/admin/Headers/PageHeader";
import { BrandsTable } from "@/components/admin/Brands/Table/BrandsTable";
import { API_BASE_URL, API_VERSION } from "@/app/constants/api";
import { Brand } from "@/app/types/models/Brand";

const ITEMS_PER_PAGE = 10;

interface BrandsApiResponse {
    data: Brand[];
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

interface BrandType {
    id: string;
    name: string;
    description?: string;
    createdAt?: string;
    updatedAt?: string;
}

interface BrandTypesApiResponse {
    data: BrandType[];
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

export default function BrandsPage() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [brands, setBrands] = useState<Brand[]>([]);
    const [brandTypes, setBrandTypes] = useState<BrandType[]>([]);
    const [loading, setLoading] = useState(true);
    const [brandTypesLoading, setBrandTypesLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
    const [selectedBrandTypeIds, setSelectedBrandTypeIds] = useState<string[]>([]);

    // Get the current page from URL or default to 1
    const pageParam = searchParams.get('page');
    const queryParam = searchParams.get('query');
    const statusParam = searchParams.get('status') || '';
    const brandTypeIdParam = searchParams.get('brandTypeId') || '';
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

    // Parsiramo brandTypeId iz URL parametra
    useEffect(() => {
        if (brandTypeIdParam) {
            const brandTypeIdArray = brandTypeIdParam.split(',');
            setSelectedBrandTypeIds(brandTypeIdArray);
        } else {
            setSelectedBrandTypeIds([]);
        }
    }, [brandTypeIdParam]);

    // Učitavamo tipove brendova sa API-a
    const fetchBrandTypes = async () => {
        try {
            setBrandTypesLoading(true);
            const url = new URL(`${API_BASE_URL}/api/${API_VERSION}/brand-types`);
            url.searchParams.set('limit', '100'); // Pretpostavljamo da će 100 biti dovoljno za sve tipove
            url.searchParams.set('page', '1');
            
            const response = await fetch(url.toString(), {
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error(`Error fetching brand types: ${response.status}`);
            }

            const data: BrandTypesApiResponse = await response.json();
            setBrandTypes(data.data || []);
        } catch (error) {
            console.error('Error fetching brand types:', error);
            setBrandTypes([]);
        } finally {
            setBrandTypesLoading(false);
        }
    };

    const fetchBrands = async (page: number, query?: string, statuses?: string[], brandTypeIds?: string[]) => {
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

            // Dodajemo brandTypeId parametre ako postoje
            if (brandTypeIds && brandTypeIds.length > 0) {
                urlParams.set('brandTypeId', brandTypeIds.join(','));
            }
            
            const url = `${API_BASE_URL}/api/${API_VERSION}/brands?${urlParams.toString()}`;
            
            const response = await fetch(url, {
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Error fetching brands: ${response.status}`);
            }

            const data: BrandsApiResponse = await response.json();

            // Validate pagination data
            const validTotal = typeof data.pagination.total === 'number' && data.pagination.total >= 0;
            const validTotalPages = typeof data.pagination.totalPages === 'number' && data.pagination.totalPages >= 0;
            
            if (!validTotal || !validTotalPages) {
                throw new Error('Invalid pagination data received from server');
            }

            setBrands(data.data || []);
            
            // This is important - we're setting these values regardless of page change
            setTotalPages(Math.max(1, data.pagination.totalPages));
            setTotalItems(data.pagination.total);
            
            // Update URL only if the page from API is different
            const apiPage = data.pagination.page || page;
            if (apiPage !== page) {
                updateUrlParams({ page: apiPage });
            }
        } catch (error) {
            console.error("Failed to fetch brands:", error);
            // Don't reset pagination data on error, maintain previous state
            setBrands([]);
        } finally {
            setLoading(false);
        }
    };

    // Update URL with the current page, query, status, and brandTypeId
    const updateUrlParams = (params: { page?: number, statuses?: string[], brandTypeIds?: string[] }) => {
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
        
        if (params.brandTypeIds !== undefined) {
            if (params.brandTypeIds && params.brandTypeIds.length > 0) {
                newParams.set('brandTypeId', params.brandTypeIds.join(','));
            } else {
                newParams.delete('brandTypeId');
            }
        }
        
        // Koristimo replace umesto push da ne dodajemo u history stack
        router.replace(`${pathname}?${newParams.toString()}`);
    };

    // Efekat za učitavanje tipova brendova
    useEffect(() => {
        fetchBrandTypes();
    }, []);

    // Efekat za ažuriranje URL-a kada se promene statusi
    useEffect(() => {
        updateUrlParams({ statuses: selectedStatuses, page: 1 });
    }, [selectedStatuses]);

    // Efekat za ažuriranje URL-a kada se promene tipovi
    useEffect(() => {
        updateUrlParams({ brandTypeIds: selectedBrandTypeIds, page: 1 });
    }, [selectedBrandTypeIds]);

    // Efekat za učitavanje brendova
    useEffect(() => {
        if (currentPage >= 1) {
            const statusArray = statusParam ? statusParam.split(',') : [];
            const brandTypeIdArray = brandTypeIdParam ? brandTypeIdParam.split(',') : [];
            fetchBrands(currentPage, queryParam || undefined, statusArray, brandTypeIdArray);
        }
    }, [currentPage, queryParam, statusParam, brandTypeIdParam]);

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
                title="Brand Management" 
                count={totalItems} 
                buttonText="Add new brand" 
                buttonUrl="/brands/create" 
            />

            <BrandsTable 
                brands={brands}
                brandTypes={brandTypes}
                loading={loading || brandTypesLoading}
                totalItems={totalItems}
                totalPages={totalPages}
                currentPage={currentPage}
                goToNextPage={goToNextPage}
                goToPreviousPage={goToPreviousPage}
                goToPage={goToPage}
                fetchBrands={fetchBrands}
                selectedStatuses={selectedStatuses}
                onStatusesChange={setSelectedStatuses}
                selectedBrandTypeIds={selectedBrandTypeIds}
                onBrandTypeIdsChange={setSelectedBrandTypeIds}
            />
        </AdminLayout>
    );
}