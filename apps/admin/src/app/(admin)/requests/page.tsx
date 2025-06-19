"use client"

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

import AdminLayout from "../AdminLayout";
import PageHeader from "@/components/admin/Headers/PageHeader";
import { API_BASE_URL, API_VERSION } from "@/app/constants/api";
import { ClaimRequest } from "@/app/types/models/ClaimRequest";
import ClaimRequestsTable from "@/components/admin/ClaimRequests/Table/ClaimRequestsTable";

const ITEMS_PER_PAGE = 10; // Uskladjeno sa serverskom stranom

interface ClaimRequestsApiResponse {
  data: ClaimRequest[];
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

export default function ClaimRequestsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [requests, setRequests] = useState<ClaimRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  // Funkcija za dohvatanje podataka
  const fetchRequests = async (page: number = 1, query?: string) => {
    try {
      setLoading(true);
      
      // Kreiramo URL sa parametrima
      const params = new URLSearchParams();
      params.set('page', page.toString());
      params.set('limit', ITEMS_PER_PAGE.toString());
      
      if (query) {
        params.set('query', query);
      }

      const response = await fetch(
        `${API_BASE_URL}/api/${API_VERSION}/claim-requests?${params.toString()}`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch claim requests: ${response.status}`);
      }

      const data: ClaimRequestsApiResponse = await response.json();
      
      setRequests(data.data || []);
      setTotalItems(data.pagination.total);
      setTotalPages(data.pagination.totalPages);
      setCurrentPage(data.pagination.page);
    } catch (error) {
      console.error("Error fetching claim requests:", error);
      // Možete dodati toast notifikaciju ovde
    } finally {
      setLoading(false);
    }
  };

  // Inicijalno učitavanje podataka
  useEffect(() => {
    const page = parseInt(searchParams.get('page') || '1');
    const query = searchParams.get('query') || '';
    
    fetchRequests(page, query);
  }, [searchParams]);

  // Funkcije za navigaciju
  const goToNextPage = () => {
    const nextPage = currentPage + 1;
    if (nextPage <= totalPages) {
      const params = new URLSearchParams(searchParams.toString());
      params.set('page', nextPage.toString());
      router.push(`${pathname}?${params.toString()}`);
    }
  };

  const goToPreviousPage = () => {
    const prevPage = currentPage - 1;
    if (prevPage >= 1) {
      const params = new URLSearchParams(searchParams.toString());
      params.set('page', prevPage.toString());
      router.push(`${pathname}?${params.toString()}`);
    }
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      const params = new URLSearchParams(searchParams.toString());
      params.set('page', page.toString());
      router.push(`${pathname}?${params.toString()}`);
    }
  };

  return (
    <AdminLayout>
      <PageHeader 
        title="Claim Requests Management" 
        count={totalItems} 
        buttonText="View All Requests" 
        buttonUrl="/requests" 
      />
      <ClaimRequestsTable 
        requests={requests}
        loading={loading}
        totalItems={totalItems}
        totalPages={totalPages}
        currentPage={currentPage}
        goToNextPage={goToNextPage}
        goToPreviousPage={goToPreviousPage}
        goToPage={goToPage}
        fetchClaimRequests={fetchRequests}
      />
    </AdminLayout>
  );
} 