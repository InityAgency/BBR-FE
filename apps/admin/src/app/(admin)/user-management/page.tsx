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

interface Role {
    id: string;
    name: string;
    description?: string;
    createdAt?: string;
    updatedAt?: string;
}

interface RolesApiResponse {
    data: Role[];
    statusCode: number;
    message: string;
    pagination: {
        total: number;
        totalPages: number;
        page: number;
        limit: number;
    };
}

export default function UserManagementPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(true);
    const [rolesLoading, setRolesLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
    const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>([]);

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    
    const currentPage = Number(searchParams.get('page')) || 1;
    const queryParam = searchParams.get('query') || '';
    const statusParam = searchParams.get('status') || '';
    const roleIdParam = searchParams.get('roleId') || '';

    // Parsiramo status iz URL paramtra
    useEffect(() => {
        if (statusParam) {
            const statusArray = statusParam.split(',');
            setSelectedStatuses(statusArray);
        } else {
            setSelectedStatuses([]);
        }
    }, [statusParam]);

    // Parsiramo roleId iz URL parametra
    useEffect(() => {
        if (roleIdParam) {
            const roleIdArray = roleIdParam.split(',');
            setSelectedRoleIds(roleIdArray);
        } else {
            setSelectedRoleIds([]);
        }
    }, [roleIdParam]);

    // Učitavamo uloge sa API-a
    const fetchRoles = async () => {
        try {
            setRolesLoading(true);
            const url = new URL(`${API_BASE_URL}/api/${API_VERSION}/roles`);
            url.searchParams.set('limit', '100'); // Pretpostavljamo da će 100 biti dovoljno za sve uloge
            url.searchParams.set('page', '1');
            
            const response = await fetch(url.toString(), {
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error(`Error fetching roles: ${response.status}`);
            }

            const data: RolesApiResponse = await response.json();
            setRoles(data.data || []);
        } catch (error) {
            console.error('Error fetching roles:', error);
            setRoles([]);
        } finally {
            setRolesLoading(false);
        }
    };

    const fetchUsers = async (page: number, query?: string, statuses?: string[], roleIds?: string[]) => {
        try {
            setLoading(true);
            
            // Kreiramo URL sa parametrima
            const url = new URL(`${API_BASE_URL}/api/${API_VERSION}/users`);
            url.searchParams.set('page', page.toString());
            url.searchParams.set('limit', ITEMS_PER_PAGE.toString());
            if (query) {
                url.searchParams.set('query', query);
            }
            // Dodajemo status parametre ako postoje
            if (statuses && statuses.length > 0) {
                url.searchParams.set('status', statuses.join(','));
            }
            // Dodajemo roleId parametre ako postoje
            if (roleIds && roleIds.length > 0) {
                url.searchParams.set('roleId', roleIds.join(','));
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

    const updateUrlParams = (params: { page?: number, statuses?: string[], roleIds?: string[] }) => {
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
        
        if (params.roleIds !== undefined) {
            if (params.roleIds && params.roleIds.length > 0) {
                newParams.set('roleId', params.roleIds.join(','));
            } else {
                newParams.delete('roleId');
            }
        }
        
        router.replace(`${pathname}?${newParams.toString()}`);
    };

    // Efekat za učitavanje uloga
    useEffect(() => {
        fetchRoles();
    }, []);

    // Efekat za ažuriranje URL-a kada se promene statusi
    useEffect(() => {
        updateUrlParams({ statuses: selectedStatuses, page: 1 });
    }, [selectedStatuses]);

    // Efekat za ažuriranje URL-a kada se promene uloge
    useEffect(() => {
        updateUrlParams({ roleIds: selectedRoleIds, page: 1 });
    }, [selectedRoleIds]);

    // Efekat za učitavanje korisnika
    useEffect(() => {
        const statusArray = statusParam ? statusParam.split(',') : [];
        const roleIdArray = roleIdParam ? roleIdParam.split(',') : [];
        fetchUsers(currentPage, queryParam, statusArray, roleIdArray);
    }, [currentPage, queryParam, statusParam, roleIdParam]);

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
                title="User Management"
                buttonText="Add New User"
                buttonUrl="/user-management/create"
                count={totalItems}
            />
            <UsersTable 
                users={users}
                roles={roles}
                loading={loading || rolesLoading}
                totalItems={totalItems}
                totalPages={totalPages}
                currentPage={currentPage}
                goToNextPage={goToNextPage}
                goToPreviousPage={goToPreviousPage}
                goToPage={goToPage}
                selectedStatuses={selectedStatuses}
                onStatusesChange={setSelectedStatuses}
                selectedRoleIds={selectedRoleIds}
                onRoleIdsChange={setSelectedRoleIds}
            />
        </AdminLayout>
    );
}