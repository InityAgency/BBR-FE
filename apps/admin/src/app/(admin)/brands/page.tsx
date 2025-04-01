// app/admin/brands/page.tsx
"use client"

import React, { useState, useEffect } from "react";
import AdminLayout from "../AdminLayout";
import PageHeader from "@/components/admin/Headers/PageHeader";
import { BrandsTable } from "@/components/admin/Brands/Table/BrandsTable";
import { API_BASE_URL, API_VERSION } from "@/app/constants/api";
import { Brand } from "@/app/types/models/Brand";
import { useSearchParams } from "next/navigation";

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

export default function BrandsPage() {
  const searchParams = useSearchParams();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Fetch funkcija za dohvatanje brendova
  const fetchBrands = async (page: number) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/${API_VERSION}/brands?limit=${ITEMS_PER_PAGE}&page=${page}`,
        {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
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
      setTotalPages(Math.max(1, data.pagination.totalPages));
      setTotalItems(data.pagination.total);
      setCurrentPage(data.pagination.page || page);
    } catch (error) {
      console.error('Error fetching brands:', error);
      setBrands([]);
      setTotalPages(1);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands(currentPage);
  }, [currentPage]); // Re-fetch when page changes

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
        title="Brand Management" 
        count={totalItems} 
        buttonText="Add new brand" 
        buttonUrl="/brands/create" 
      />

      <BrandsTable 
        brands={brands}
        loading={loading}
        totalItems={totalItems}
        totalPages={totalPages}
        currentPage={currentPage}
        goToNextPage={goToNextPage}
        goToPreviousPage={goToPreviousPage}
        goToPage={goToPage}
        initialStatusFilter={searchParams.get("status")}
        fetchBrands={fetchBrands}
      />
    </AdminLayout>
  );
}