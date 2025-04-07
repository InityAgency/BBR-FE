"use client"

import React, { useEffect, useState } from "react";
import AdminLayout from "../../AdminLayout";
import PageHeader from "@/components/admin/Headers/PageHeader";
import { BrandTypesTable } from "@/components/admin/BrandTypes/Table/BrandTypesTable";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { BrandType } from "@/app/types/models/BrandType";
import { API_BASE_URL, API_VERSION } from "@/app/constants/api";

const ITEMS_PER_PAGE = 10;

interface BrandTypesApiResponse {
    data: BrandType[];
    statusCode: number;
    message: string;
    pagination: {
        total: number;
        page: number;
        limit: number;
    };
}

export default function BrandTypesPage() {
    const [brandTypes, setBrandTypes] = useState<BrandType[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    
    const currentPage = Number(searchParams.get('page')) || 1;
    const queryParam = searchParams.get('query') || '';

    const fetchBrandTypes = async (page: number, query?: string) => {
        try {
            setLoading(true);
            
            // Kreiramo URL sa parametrima
            const url = new URL(`${API_BASE_URL}/api/${API_VERSION}/brand-types`);
            url.searchParams.set('page', page.toString());
            url.searchParams.set('limit', ITEMS_PER_PAGE.toString());
            if (query) {
                url.searchParams.set('query', query);
            }
            
            const response = await fetch(url.toString(), {
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            const data: BrandTypesApiResponse = await response.json();
            
            if (data.statusCode === 200) {
                setBrandTypes(data.data);
                setTotalPages(Math.ceil(data.pagination.total / ITEMS_PER_PAGE));
                setTotalItems(data.pagination.total);
            } else {
                console.error('Error fetching brand types:', data.message);
            }
        } catch (error) {
            console.error('Error fetching brand types:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateUrlWithPage = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', page.toString());
        router.replace(`${pathname}?${params.toString()}`);
    };

    useEffect(() => {
        fetchBrandTypes(currentPage, queryParam);
    }, [currentPage, queryParam]);

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            updateUrlWithPage(currentPage + 1);
        }
    };

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            updateUrlWithPage(currentPage - 1);
        }
    };

    const goToPage = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            updateUrlWithPage(page);
        }
    };

    return (
        <AdminLayout>
            <PageHeader 
                title="Brand Types" 
                count={totalItems} 
                buttonText="Add new brand type" 
                buttonUrl="/brands/types/create" 
            />

            <BrandTypesTable 
                brandTypes={brandTypes}
                loading={loading}
                totalItems={totalItems}
                totalPages={totalPages}
                currentPage={currentPage}
                goToNextPage={goToNextPage}
                goToPreviousPage={goToPreviousPage}
                goToPage={goToPage}
            />
        </AdminLayout>
    );
}