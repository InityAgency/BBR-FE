"use client"

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import AdminLayout from "../../AdminLayout";
import PageHeader from "@/components/admin/Headers/PageHeader";
import { API_BASE_URL, API_VERSION } from "@/app/constants/api";
import { Lifestyle } from "@/app/types/models/Lifestyles";
import LifestylesTable from "@/components/admin/Lifestyles/Table/LifestylesTable";

const ITEMS_PER_PAGE = 12;

interface LifestylesApiResponse {
    data: Lifestyle[];
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

export default function LifestylesPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [lifestyles, setLifestyles] = useState<Lifestyle[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    // Get the current page from URL or default to 1
    const pageParam = searchParams.get('page');
    const queryParam = searchParams.get('query');
    const currentPage = pageParam ? parseInt(pageParam, 10) : 1;

    const fetchLifestyles = async (page: number, query?: string) => {
        setLoading(true);
        try {
            // Kreiramo URL parametre
            const urlParams = new URLSearchParams();
            urlParams.set('limit', ITEMS_PER_PAGE.toString());
            urlParams.set('page', page.toString());
            
            // Dodajemo query parametar ako postoji
            if (query) {
                urlParams.set('query', query);
            }
            
            const url = `${API_BASE_URL}/api/${API_VERSION}/lifestyles?${urlParams.toString()}`;
            
            const response = await fetch(url, {
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Error fetching lifestyles: ${response.status}`);
            }

            const data: LifestylesApiResponse = await response.json();

            // Validate pagination data
            const validTotal = typeof data.pagination.total === 'number' && data.pagination.total >= 0;
            const validTotalPages = typeof data.pagination.totalPages === 'number' && data.pagination.totalPages >= 0;
            
            if (!validTotal || !validTotalPages) {
                throw new Error('Invalid pagination data received from server');
            }

            setLifestyles(data.data || []);
            
            // This is important - we're setting these values regardless of page change
            setTotalPages(Math.max(1, data.pagination.totalPages));
            setTotalItems(data.pagination.total);
            
            // Update URL only if the page from API is different
            const apiPage = data.pagination.page || page;
            if (apiPage !== page) {
                updateUrlWithPage(apiPage, query);
            }
        } catch (error) {
            console.error("Failed to fetch lifestyles:", error);
            // Don't reset pagination data on error, maintain previous state
            setLifestyles([]);
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
        router.replace(`/residences/lifestyles?${params.toString()}`);
    };

    useEffect(() => {
        if (currentPage >= 1) {
            fetchLifestyles(currentPage, queryParam || undefined);
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
                title="Lifestyle Management"
                count={totalItems}
                buttonText="Add new lifestyle"
                buttonUrl="/residences/lifestyles/create"
            />
            
            <LifestylesTable
                lifestyles={lifestyles}
                loading={loading}
                totalItems={totalItems}
                totalPages={totalPages}
                currentPage={currentPage}
                goToNextPage={goToNextPage} 
                goToPreviousPage={goToPreviousPage}
                goToPage={goToPage}
                fetchLifestyles={fetchLifestyles}
            />  
        </AdminLayout>
    );
}