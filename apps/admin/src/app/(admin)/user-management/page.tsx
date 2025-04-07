"use client";

import React, { useState, useEffect } from "react";
import PageHeader from "@/components/admin/Headers/PageHeader";
import { UsersTable } from "@/components/admin/Users/Table/UsersTable";
import AdminLayout from "../AdminLayout";
import { User } from "@/lib/api/services/types";
import { API_BASE_URL, API_VERSION } from "@/app/constants/api";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

const ITEMS_PER_PAGE = 10;

interface UsersApiResponse {
    data: User[];
    statusCode: number;
    message: string;
    pagination: {
        total: number;
        page: number;
        limit: number;
    };
}

export default function UserManagementPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    
    const currentPage = Number(searchParams.get('page')) || 1;
    const queryParam = searchParams.get('query') || '';

    const fetchUsers = async (page: number, query?: string) => {
        try {
            setLoading(true);
            
            // Kreiramo URL sa parametrima
            const url = new URL(`${API_BASE_URL}/api/${API_VERSION}/users`);
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
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Error fetching users: ${response.status}`);
            }

            const data: UsersApiResponse = await response.json();

            // Validate pagination data
            const validTotal = typeof data.pagination.total === 'number' && data.pagination.total >= 0;
            
            if (!validTotal) {
                throw new Error('Invalid pagination data received from server');
            }

            setUsers(data.data || []);
            setTotalPages(Math.ceil(data.pagination.total / ITEMS_PER_PAGE));
            setTotalItems(data.pagination.total);
        } catch (error) {
            console.error('Error fetching users:', error);
            setUsers([]);
            setTotalPages(1);
            setTotalItems(0);
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
        fetchUsers(currentPage, queryParam);
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
                title="User Management"
                buttonText="Add New User"
                buttonUrl="/user-management/create"
                count={totalItems}
            />
            <UsersTable 
                users={users}
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
