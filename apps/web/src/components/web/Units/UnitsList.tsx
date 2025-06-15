"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { UnitsTable } from "./Tables/UnitsTable";
import { Unit } from "@/app/types/models/Unit";
import { API_BASE_URL, API_VERSION } from "@/app/constants/api";

const ITEMS_PER_PAGE = 10;

interface UnitsApiResponse {
  data: Unit[];
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

interface UnitsListProps {
  residenceId: string;
  onTotalUnitsChange?: (total: number) => void;
}

export function UnitsList({ residenceId, onTotalUnitsChange }: UnitsListProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const currentPage = Number(searchParams.get("page")) || 1;

  const fetchUnits = async (page: number) => {
    setLoading(true);
    try {
      const url = new URL(`${API_BASE_URL}/api/${API_VERSION}/units`);
      url.searchParams.set("residenceId", residenceId);
      url.searchParams.set("limit", ITEMS_PER_PAGE.toString());
      url.searchParams.set("page", page.toString());

      const response = await fetch(url.toString(), {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error fetching units: ${response.status}`);
      }

      const data: UnitsApiResponse = await response.json();

      // Validate response data
      const validTotal = typeof data.pagination.total === "number" && data.pagination.total >= 0;
      const validTotalPages = typeof data.pagination.totalPages === "number" && data.pagination.totalPages >= 0;

      if (!validTotal || !validTotalPages) {
        throw new Error("Invalid pagination data received from server");
      }

      setUnits(data.data || []);
      setTotalPages(Math.max(1, data.pagination.totalPages));
      setTotalItems(data.pagination.total);

      // Notify parent component
      if (onTotalUnitsChange) {
        onTotalUnitsChange(data.pagination.total);
      }

      // Update URL if API returned different page
      const apiPage = data.pagination.page || page;
      if (apiPage !== page) {
        updateUrlParams({ page: apiPage });
      }
    } catch (error) {
      console.error("Failed to fetch units:", error);
      setUnits([]);
      setTotalPages(1);
      setTotalItems(0);
      if (onTotalUnitsChange) {
        onTotalUnitsChange(0);
      }
    } finally {
      setLoading(false);
    }
  };

  const updateUrlParams = (params: { page?: number }) => {
    const newParams = new URLSearchParams(searchParams.toString());
    
    if (params.page !== undefined) {
      newParams.set("page", params.page.toString());
    }

    router.replace(`${pathname}?${newParams.toString()}`, { scroll: false });
  };

  // Fetch units when page changes
  useEffect(() => {
    if (residenceId && currentPage >= 1) {
      fetchUnits(currentPage);
    }
  }, [residenceId, currentPage]);

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
    <UnitsTable
      units={units}
      loading={loading}
      totalItems={totalItems}
      totalPages={totalPages}
      currentPage={currentPage}
      goToNextPage={goToNextPage}
      goToPreviousPage={goToPreviousPage}
      goToPage={goToPage}
      fetchUnits={fetchUnits}
      residenceId={residenceId}
    />
  );
}