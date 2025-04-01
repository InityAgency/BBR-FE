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
    const currentPage = pageParam ? parseInt(pageParam, 10) : 1;

    const fetchLifestyles = async (page: number) => {
        setLoading(true);
        try {
            const response = await fetch(
                `${API_BASE_URL}/api/${API_VERSION}/lifestyles?limit=${ITEMS_PER_PAGE}&page=${page}`,
                {
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

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
                updateUrlWithPage(apiPage);
            }
        } catch (error) {
            console.error("Failed to fetch lifestyles:", error);
            // Don't reset pagination data on error, maintain previous state
            setLifestyles([]);
        } finally {
            setLoading(false);
        }
    };

    // Update URL with the current page
    const updateUrlWithPage = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', page.toString());
        // Use replace instead of push to avoid adding to history stack for pagination
        router.push(`/residences/lifestyles?${params.toString()}`);
    };

    useEffect(() => {
        if (currentPage >= 1) {
            fetchLifestyles(currentPage);
        }
    }, [currentPage]); // Re-fetch when currentPage changes

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