"use client"

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

import AdminLayout from "../../AdminLayout";
import PageHeader from "@/components/admin/Headers/PageHeader";
import { API_BASE_URL, API_VERSION } from "@/app/constants/api";
import { ClaimRequest, ClaimRequestsApiResponse } from "@/app/types/models/ClaimRequest";
import ClaimRequestsTable from "@/components/admin/ClaimRequests/Table/ClaimRequestsTable";

const ITEMS_PER_PAGE = 10; // Uskladjeno sa serverskom stranom

export default function ResidencesClaimRequests() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [requests, setRequests] = useState<ClaimRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Get the current page from URL or default to 1
  const pageParam = searchParams.get('page');
  const queryParam = searchParams.get('query');
  const currentPage = pageParam ? parseInt(pageParam, 10) : 1;

  const fetchClaimRequests = async (page: number, query?: string) => {
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
      
      const url = `${API_BASE_URL}/api/${API_VERSION}/claim-profile-contact-forms?${urlParams.toString()}&sortBy=createdAt&sortOrder=desc`;
      
      const response = await fetch(url, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error fetching claim requests: ${response.status}`);
      }
      
      const data: ClaimRequestsApiResponse = await response.json();
      
      // Validate pagination data
      const validTotal = typeof data.pagination.total === 'number' && data.pagination.total >= 0;
      const validTotalPages = typeof data.pagination.totalPages === 'number' && data.pagination.totalPages >= 0;
      
      if (!validTotal || !validTotalPages) {
        throw new Error('Invalid pagination data received from server');
      }

      setRequests(data.data || []);
      
      // This is important - we're setting these values directly from API response
      setTotalPages(Math.max(1, data.pagination.totalPages));
      setTotalItems(data.pagination.total);
      
      // Update URL if the page from API is different from the requested page
      const apiPage = data.pagination.page || page;
      if (apiPage !== page) {
        updateUrlWithPage(apiPage, query);
      }
    } catch (error) {
      console.error('Error fetching claim requests:', error);
      setRequests([]);
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
    // Ovaj useEffect će se aktivirati na svaku promenu URL-a
    if (currentPage >= 1) {
      // Šaljemo query samo ako nije prazan string
      const query = queryParam && queryParam.trim() !== '' ? queryParam : undefined;
      fetchClaimRequests(currentPage, query);
    }
  }, [pathname, searchParams]); // Dodali smo pathname i searchParams kao dependencies

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
        title="Claim Requests" 
        count={totalItems} 
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
        fetchClaimRequests={fetchClaimRequests}
      />
    </AdminLayout>
  );
}
