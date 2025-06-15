"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { LeadsTable } from "@/components/web/Leads/Table/LeadsTable";
import { API_BASE_URL, API_VERSION } from "@/app/constants/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";

const ITEMS_PER_PAGE = 10;

interface Lead {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    status: string;
    phone: string;
    preferredContactMethod: string[];
    createdAt: string;
    updatedAt: string;
    requests: any[];
}

interface LeadsApiResponse {
    data?: Lead[];
    statusCode?: number;
    message?: string;
    pagination?: {
        total?: number;
        totalPages?: number;
        page?: number;
        limit?: number;
    };
    timestamp?: string;
    path?: string;
}

export default function DeveloperLeads() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [error, setError] = useState<string | null>(null);
    const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
    const [queryParam, setQueryParam] = useState("");
    
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const fetchLeads = async (page: number, query?: string, statuses?: string[]) => {
        try {
            setLoading(true);
            setError(null);
            
            console.log('API_BASE_URL:', API_BASE_URL);
            console.log('API_VERSION:', API_VERSION);
            
            let url = `${API_BASE_URL}/api/${API_VERSION}/leads?page=${page}&limit=${ITEMS_PER_PAGE}`;
            
            if (query) {
                url += `&search=${encodeURIComponent(query)}`;
            }
            
            if (statuses && statuses.length > 0) {
                url += `&status=${statuses.join(',')}`;
            }
            
            console.log('Constructed URL:', url);
            
            const response = await fetch(url, {
                credentials: "include"
            });
            
            console.log('Response status:', response.status);
            console.log('Response ok:', response.ok);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data: LeadsApiResponse = await response.json();
            console.log('Response data:', data);

            setLeads(data.data || []);
            setTotalItems(data.pagination?.total || 0);
            setTotalPages(data.pagination?.totalPages || 1);
            setCurrentPage(data.pagination?.page || 1);
        } catch (error) {
            console.error('Fetch error:', error);
            setError("An error occurred while loading leads.");
            setLeads([]);
            setTotalItems(0);
            setTotalPages(1);
            setCurrentPage(1);
        } finally {
            setLoading(false);
        }
    };

    const updateUrlParams = (params: {
        page?: number;
        query?: string;
        statuses?: string[];
    }) => {
        const urlParams = new URLSearchParams(searchParams);
        
        if (params.page !== undefined) {
            urlParams.set("page", params.page.toString());
        }
        
        if (params.query !== undefined) {
            if (params.query) {
                urlParams.set("query", params.query);
            } else {
                urlParams.delete("query");
            }
        }
        
        if (params.statuses !== undefined) {
            if (params.statuses.length > 0) {
                urlParams.set("statuses", params.statuses.join(","));
            } else {
                urlParams.delete("statuses");
            }
        }
        
        router.push(`${pathname}?${urlParams.toString()}`);
    };

    useEffect(() => {
        const page = Number(searchParams.get("page")) || 1;
        const query = searchParams.get("query") || "";
        const statusesParam = searchParams.get("statuses");
        const statuses = statusesParam ? statusesParam.split(",") : [];
        
        setQueryParam(query);
        setSelectedStatuses(statuses);
        fetchLeads(page, query, statuses);
    }, [searchParams]);

    const goToPage = (page: number) => {
        updateUrlParams({ page });
    };

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            goToPage(currentPage + 1);
        }
    };

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            goToPage(currentPage - 1);
        }
    };

    const handleQueryChange = (query: string) => {
        setQueryParam(query);
        updateUrlParams({ query, page: 1 });
    };

    const handleStatusesChange = (statuses: string[]) => {
        setSelectedStatuses(statuses);
        updateUrlParams({ statuses, page: 1 });
    };

    return (
        <div className="flex flex-col gap-4 py-8">
            <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <h1 className="text-xl font-bold sm:text-2xl text-sans">Leads</h1>
                            <Badge variant="outline" className="self-start sm:self-auto px-2 py-1 text-sm">
                                {totalItems} {totalItems === 1 ? 'lead' : 'leads'}
                            </Badge>
                        </div>
                    </div>
                </div>
            
            {error && (
                <div className="text-red-500 font-semibold border border-red-200 bg-red-50 p-4 rounded-md">
                    {error}
                </div>
            )}
            
            <LeadsTable
                leads={leads}
                loading={loading}
                totalItems={totalItems}
                totalPages={totalPages}
                currentPage={currentPage}
                queryParam={queryParam}
                goToNextPage={goToNextPage}
                goToPreviousPage={goToPreviousPage}
                goToPage={goToPage}
                selectedStatuses={selectedStatuses}
                onStatusesChange={handleStatusesChange}
                onQueryChange={handleQueryChange}
                updateUrlParams={updateUrlParams}
            />
        </div>
    );
}