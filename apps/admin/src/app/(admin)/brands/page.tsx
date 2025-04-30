"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import AdminLayout from "../AdminLayout";
import PageHeader from "@/components/admin/Headers/PageHeader";
import { BrandsTable } from "@/components/admin/Brands/Table/BrandsTable";
import { API_BASE_URL, API_VERSION } from "@/app/constants/api";
import { Brand } from "@/app/types/models/Brand";

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

interface BrandType {
  id: string;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

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

export default function BrandsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [brandTypes, setBrandTypes] = useState<BrandType[]>([]);
  const [loading, setLoading] = useState(true);
  const [brandTypesLoading, setBrandTypesLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedBrandTypeIds, setSelectedBrandTypeIds] = useState<string[]>([]);

  const currentPage = Number(searchParams.get("page")) || 1;
  const queryParam = searchParams.get("query") || "";

  // Parse status and brandTypeId from URL parameters
  useEffect(() => {
    const statusValues = searchParams.getAll("status");
    const brandTypeIdValues = searchParams.getAll("brandTypeId");
    setSelectedStatuses(statusValues);
    setSelectedBrandTypeIds(brandTypeIdValues);
  }, [searchParams]);

  // Fetch brand types from API
  const fetchBrandTypes = async () => {
    try {
      setBrandTypesLoading(true);
      const url = new URL(`${API_BASE_URL}/api/${API_VERSION}/brand-types`);
      url.searchParams.set("limit", "100");
      url.searchParams.set("page", "1");

      const response = await fetch(url.toString(), {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error fetching brand types: ${response.status}`);
      }

      const data: BrandTypesApiResponse = await response.json();
      setBrandTypes(data.data || []);
    } catch (error) {
      console.error("Error fetching brand types:", error);
      setBrandTypes([]);
    } finally {
      setBrandTypesLoading(false);
    }
  };

  const fetchBrands = async (
    page: number,
    query?: string,
    statuses?: string[],
    brandTypeIds?: string[]
  ) => {
    setLoading(true);
    try {
      const url = new URL(`${API_BASE_URL}/api/${API_VERSION}/brands`);
      url.searchParams.set("limit", ITEMS_PER_PAGE.toString());
      url.searchParams.set("page", page.toString());

      if (query && query.trim() !== "") {
        url.searchParams.set("query", query);
      }

      if (statuses && statuses.length > 0) {
        statuses.forEach((status) => {
          url.searchParams.append("status", status);
        });
      }

      if (brandTypeIds && brandTypeIds.length > 0) {
        brandTypeIds.forEach((brandTypeId) => {
          url.searchParams.append("brandTypeId", brandTypeId);
        });
      }

      const response = await fetch(url.toString(), {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error fetching brands: ${response.status}`);
      }

      const data: BrandsApiResponse = await response.json();

      const validTotal =
        typeof data.pagination.total === "number" &&
        data.pagination.total >= 0;
      const validTotalPages =
        typeof data.pagination.totalPages === "number" &&
        data.pagination.totalPages >= 0;

      if (!validTotal || !validTotalPages) {
        throw new Error("Invalid pagination data received from server");
      }

      setBrands(data.data || []);
      setTotalPages(Math.max(1, data.pagination.totalPages));
      setTotalItems(data.pagination.total);

      // Update URL to reflect the API's returned page, preserving filters
      const apiPage = data.pagination.page || page;
      if (apiPage !== page) {
        updateUrlParams({ page: apiPage });
      }
    } catch (error) {
      console.error("Failed to fetch brands:", error);
      setBrands([]);
    } finally {
      setLoading(false);
    }
  };

  const updateUrlParams = (params: {
    page?: number;
    query?: string;
    statuses?: string[];
    brandTypeIds?: string[];
  }) => {
    const newParams = new URLSearchParams();

    // Always set page
    newParams.set("page", (params.page ?? currentPage).toString());

    // Set query if provided or preserve existing
    if (params.query !== undefined) {
      if (params.query.trim() !== "") {
        newParams.set("query", params.query);
      }
    } else if (queryParam) {
      newParams.set("query", queryParam);
    }

    // Set statuses if provided or preserve existing
    if (params.statuses !== undefined) {
      params.statuses.forEach((status) => {
        newParams.append("status", status);
      });
    } else {
      selectedStatuses.forEach((status) => {
        newParams.append("status", status);
      });
    }

    // Set brandTypeIds if provided or preserve existing
    if (params.brandTypeIds !== undefined) {
      params.brandTypeIds.forEach((brandTypeId) => {
        newParams.append("brandTypeId", brandTypeId);
      });
    } else {
      selectedBrandTypeIds.forEach((brandTypeId) => {
        newParams.append("brandTypeId", brandTypeId);
      });
    }

    router.replace(`${pathname}?${newParams.toString()}`, { scroll: false });
  };

  // Fetch brand types on mount
  useEffect(() => {
    fetchBrandTypes();
  }, []);

  // Fetch brands when page, query, statuses, or brandTypeIds change
  useEffect(() => {
    if (currentPage >= 1) {
      fetchBrands(
        currentPage,
        queryParam || undefined,
        selectedStatuses,
        selectedBrandTypeIds
      );
    }
  }, [currentPage, queryParam, selectedStatuses, selectedBrandTypeIds]);

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
        title="Brand Management"
        count={totalItems}
        buttonText="Add new brand"
        buttonUrl="/brands/create"
      />

      <BrandsTable
        brands={brands}
        brandTypes={brandTypes}
        loading={loading || brandTypesLoading}
        totalItems={totalItems}
        totalPages={totalPages}
        currentPage={currentPage}
        goToNextPage={goToNextPage}
        goToPreviousPage={goToPreviousPage}
        goToPage={goToPage}
        fetchBrands={fetchBrands}
        selectedStatuses={selectedStatuses}
        onStatusesChange={setSelectedStatuses}
        selectedBrandTypeIds={selectedBrandTypeIds}
        onBrandTypeIdsChange={setSelectedBrandTypeIds}
      />
    </AdminLayout>
  );
}