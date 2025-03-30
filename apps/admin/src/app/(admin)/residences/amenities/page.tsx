// app/admin/brands/page.tsx
"use client"

import React, { useState, useEffect } from "react";

import AdminLayout from "../../AdminLayout";
import PageHeader from "@/components/admin/Headers/PageHeader";
import { API_BASE_URL, API_VERSION } from "@/app/constants/api";
import { Amenity } from "@/app/types/models/Amenities";
import { useSearchParams } from "next/navigation";
import AmenitiesTable from "@/components/admin/Amenities/Table/AmenitiesTable";

const ITEMS_PER_PAGE = 10;

interface AmenitiesApiResponse {
  data: Amenity[];
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

export default function AmenitiesPage() {
  const searchParams = useSearchParams();
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const fetchAmenities = async (page: number) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/${API_VERSION}/amenities?limit=${ITEMS_PER_PAGE}&page=${page}`,
        {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error fetching amenities: ${response.status}`);
      }
      
      const data: AmenitiesApiResponse = await response.json();
      
      setAmenities(data.data);
      setTotalPages(data.pagination.totalPages);
      setTotalItems(data.pagination.total);
    } catch (error) {
      setAmenities([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAmenities(currentPage);
  }, []);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchAmenities(nextPage);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      const prevPage = currentPage - 1;
      setCurrentPage(prevPage);
      fetchAmenities(prevPage);
    }
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
    fetchAmenities(page);
  };

  return (
    <AdminLayout>
      <PageHeader 
        title="Amenity Management" 
        count={totalItems} 
        buttonText="Add new amenity" 
        buttonUrl="/residences/amenities/create" 
      />
      <AmenitiesTable 
        amenities={amenities}
        loading={loading}
        totalItems={totalItems}
        totalPages={totalPages}
        currentPage={currentPage}
        goToNextPage={goToNextPage}
        goToPreviousPage={goToPreviousPage}
        goToPage={goToPage}
        fetchAmenities={fetchAmenities}
      />
    </AdminLayout>
  );
}