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
        console.error("API error:", errorData);
        throw new Error(`Error fetching brand types: ${response.status}`);
      }
      
      const data: BrandTypesApiResponse = await response.json();
      console.log("Brand Types API Response:", data);
      
      const brandTypesData = data.data || [];
      setBrandTypes(brandTypesData);
      
      // Postavimo totalItems na osnovu stvarnog broja podataka ako pagination.total nije tačno
      const apiTotal = data.pagination?.total || 0;
      // Ako API vraća total=0, a imamo podatke, koristimo dužinu niza
      const actualTotal = apiTotal === 0 && brandTypesData.length > 0 
        ? brandTypesData.length 
        : apiTotal;
        
      setTotalItems(actualTotal);
      
      // Izračunajmo stvaran broj stranica na osnovu stvarnog broja podataka
      const actualTotalPages = data.pagination?.totalPages || Math.ceil(actualTotal / ITEMS_PER_PAGE) || 1;
      setTotalPages(actualTotalPages);
      
    } catch (error) {
      console.error("Error fetching brand types:", error);
      setBrandTypes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrandTypes(currentPage);
  }, []);

  // Log the state values after they're set
  useEffect(() => {
    console.log("Current brandTypes state:", brandTypes);
    console.log("Loading state:", loading);
    console.log("Total items:", totalItems);
  }, [brandTypes, loading, totalItems]);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchBrandTypes(nextPage);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      const prevPage = currentPage - 1;
      setCurrentPage(prevPage);
      fetchBrandTypes(prevPage);
    }
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
    fetchBrandTypes(page);
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
