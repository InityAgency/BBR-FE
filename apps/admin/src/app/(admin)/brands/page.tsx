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

  // Parsiramo status iz URL parametara
  useEffect(() => {
    const statusValues = searchParams.getAll("status");
    if (statusValues.length > 0) {
      setSelectedStatuses(statusValues);
    }
  }, [searchParams]);

  // Parsiramo brandTypeId iz URL parametara
  useEffect(() => {
    const brandTypeIdValues = searchParams.getAll("brandTypeId");
    if (brandTypeIdValues.length > 0) {
      setSelectedBrandTypeIds(brandTypeIdValues);
    }
  }, [searchParams]);

  // Učitavamo tipove brendova sa API-a
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
    statuses?: string[];
    brandTypeIds?: string[];
  }) => {
    const newParams = new URLSearchParams(searchParams.toString());

    if (params.page !== undefined) {
      newParams.set("page", params.page.toString());
    }

    if (params.statuses !== undefined) {
      newParams.delete("status");
      if (params.statuses && params.statuses.length > 0) {
        params.statuses.forEach((status) => {
          newParams.append("status", status);
        });
      }
    }

    if (params.brandTypeIds !== undefined) {
      newParams.delete("brandTypeId");
      if (params.brandTypeIds && params.brandTypeIds.length > 0) {
        params.brandTypeIds.forEach((brandTypeId) => {
          newParams.append("brandTypeId", brandTypeId);
        });
      }
    }

    router.replace(`${pathname}?${newParams.toString()}`, { scroll: false });
  };

  // Efekat za učitavanje tipova brendova
  useEffect(() => {
    fetchBrandTypes();
  }, []);

  // Efekat za ažuriranje URL-a kada se promene statusi
  useEffect(() => {
    if (selectedStatuses.length > 0) {
      updateUrlParams({ statuses: selectedStatuses, page: 1 });
    }
  }, [selectedStatuses]);

  // Efekat za ažuriranje URL-a kada se promene tipovi
  useEffect(() => {
    if (selectedBrandTypeIds.length > 0) {
      updateUrlParams({ brandTypeIds: selectedBrandTypeIds, page: 1 });
    }
  }, [selectedBrandTypeIds]);

  // Efekat za učitavanje brendova
  useEffect(() => {
    if (currentPage >= 1) {
      fetchBrands(
        currentPage,
        queryParam || undefined,
        searchParams.getAll("status"),
        searchParams.getAll("brandTypeId")
      );
    }
  }, [currentPage, queryParam, searchParams]);

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