"use client"

import React, { useState, useEffect, useCallback } from "react";
import AdminLayout from "../../AdminLayout";
import PageHeader from "@/components/admin/Headers/PageHeader";
import { BrandTypesTable } from "@/components/admin/BrandTypes/Table/BrandTypesTable";
import { API_BASE_URL, API_VERSION } from "@/app/constants/api";
import { BrandType } from "@/app/types/models/BrandType";

const ITEMS_PER_PAGE = 10;

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

export default function BrandTypesPage() {
  const [brandTypes, setBrandTypes] = useState<BrandType[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const fetchBrandTypes = useCallback(async (page?: number) => {
    setLoading(true);
    const pageToFetch = page !== undefined ? page : currentPage;
    
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/${API_VERSION}/brand-types?limit=${ITEMS_PER_PAGE}&page=${pageToFetch}`,
        {
          credentials: 'include',
          cache: 'no-store',
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate'
          }
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error fetching brand types: ${response.status}`);
      }

      const data: BrandTypesApiResponse = await response.json();

      // Validate pagination data
      const validTotal = typeof data.pagination.total === 'number' && data.pagination.total >= 0;
      const validTotalPages = typeof data.pagination.totalPages === 'number' && data.pagination.totalPages >= 0;
      
      if (!validTotal || !validTotalPages) {
        throw new Error('Invalid pagination data received from server');
      }

      setBrandTypes(data.data || []);
      
      const calculatedTotalPages = Math.max(1, data.pagination.totalPages);
      setTotalPages(calculatedTotalPages);
      setTotalItems(data.pagination.total);

      // Ako smo dobili stranu 0 (što bi bilo čudno), postavimo na 1
      const receivedPage = Math.max(1, data.pagination.page || pageToFetch);
      
      // Ako smo na stranici koja više ne postoji (nakon brisanja poslednjeg elementa stranice)
      if (receivedPage > calculatedTotalPages && calculatedTotalPages > 0) {
        setCurrentPage(calculatedTotalPages);
      } else {
        setCurrentPage(receivedPage);
      }
    } catch (error) {
      console.error('Error fetching brand types:', error);
      setBrandTypes([]);
      setTotalPages(1);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  }, [currentPage]); // currentPage je u nizu zavisnosti

  const refetchData = useCallback(() => {
    fetchBrandTypes();
  }, [fetchBrandTypes]);

  useEffect(() => {
    fetchBrandTypes(currentPage);
  }, [currentPage, fetchBrandTypes]); // Re-fetch when page changes

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
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
        refetchData={refetchData} // Dodavanje refetchData funkcije
      />
    </AdminLayout>
  );
}