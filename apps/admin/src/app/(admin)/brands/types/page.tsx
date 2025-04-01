"use client"

import React, { useState, useEffect } from "react";
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

  // Fetch funkcija za dohvatanje tipova brendova
  const fetchBrandTypes = async (page: number) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/${API_VERSION}/brand-types?limit=${ITEMS_PER_PAGE}&page=${page}`,
        {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
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
      setTotalPages(Math.max(1, data.pagination.totalPages));
      setTotalItems(data.pagination.total);
      setCurrentPage(data.pagination.page || page);
    } catch (error) {
      console.error('Error fetching brand types:', error);
      setBrandTypes([]);
      setTotalPages(1);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrandTypes(currentPage);
  }, [currentPage]); // Re-fetch when page changes

  // Log the state values after they're set
  useEffect(() => {
  }, [brandTypes, loading, totalItems]);

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
      />
    </AdminLayout>
  );
}
