"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import AdminLayout from "../../AdminLayout";
import PageHeader from "@/components/admin/Headers/PageHeader";
import { API_BASE_URL, API_VERSION } from "@/app/constants/api";
import { RankingCategory } from "@/app/types/models/RankingCategory";
import { RankingCategoryTable } from "@/components/admin/RankingCategory/Table/RankingCategoryTable";

const ITEMS_PER_PAGE = 10;

interface RankingCategoryApiResponse {
  data: RankingCategory[];
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

interface RankingCategoryType {
  id: string;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface RankingCategoryTypesApiResponse {
  data: RankingCategoryType[];
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

export default function RankingCategoriesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [rankingCategories, setRankingCategories] = useState<RankingCategory[]>([]);
  const [rankingCategoryTypes, setRankingCategoryTypes] = useState<RankingCategoryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [typesLoading, setTypesLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedCategoryTypeIds, setSelectedCategoryTypeIds] = useState<string[]>([]);

  const currentPage = Number(searchParams.get("page")) || 1;
  const queryParam = searchParams.get("query") || "";

  // Parse status and categoryTypeId from URL parameters
  useEffect(() => {
    const statusValues = searchParams.getAll("status");
    const categoryTypeIdValues = searchParams.getAll("categoryTypeId");
    
    setSelectedStatuses(statusValues);
    setSelectedCategoryTypeIds(categoryTypeIdValues);
  }, [searchParams]);

  // Fetch ranking category types from API
  const fetchRankingCategoryTypes = async () => {
    try {
      setTypesLoading(true);
      const url = new URL(`${API_BASE_URL}/api/${API_VERSION}/ranking-category-types`);
      url.searchParams.set("limit", "100");
      url.searchParams.set("page", "1");

      const response = await fetch(url.toString(), {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error fetching ranking category types: ${response.status}`);
      }

      const data: RankingCategoryTypesApiResponse = await response.json();
      setRankingCategoryTypes(data.data || []);
    } catch (error) {
      console.error("Error fetching ranking category types:", error);
      setRankingCategoryTypes([]);
    } finally {
      setTypesLoading(false);
    }
  };

  const fetchRankingCategories = async (
    page: number,
    query?: string,
    statuses?: string[],
    categoryTypeIds?: string[]
  ) => {
    setLoading(true);
    try {
      const url = new URL(`${API_BASE_URL}/api/${API_VERSION}/ranking-categories`);
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

      if (categoryTypeIds && categoryTypeIds.length > 0) {
        categoryTypeIds.forEach((categoryTypeId) => {
          url.searchParams.append("categoryTypeId", categoryTypeId);
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
        throw new Error(`Error fetching ranking categories: ${response.status}`);
      }

      const data: RankingCategoryApiResponse = await response.json();

      const validTotal =
        typeof data.pagination.total === "number" && data.pagination.total >= 0;
      const validTotalPages =
        typeof data.pagination.totalPages === "number" && data.pagination.totalPages >= 0;

      if (!validTotal || !validTotalPages) {
        throw new Error("Invalid pagination data received from server");
      }

      setRankingCategories(data.data || []);
      setTotalPages(Math.max(1, data.pagination.totalPages));
      setTotalItems(data.pagination.total);

      // Update URL to reflect the API's returned page, preserving filters
      const apiPage = data.pagination.page || page;
      if (apiPage !== page) {
        updateUrlParams({ page: apiPage });
      }
    } catch (error) {
      console.error("Failed to fetch ranking categories:", error);
      setRankingCategories([]);
    } finally {
      setLoading(false);
    }
  };

  // Update URL with parameters
  const updateUrlParams = (params: {
    page?: number;
    query?: string;
    statuses?: string[];
    categoryTypeIds?: string[];
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

    // Set categoryTypeIds if provided or preserve existing
    if (params.categoryTypeIds !== undefined) {
      params.categoryTypeIds.forEach((categoryTypeId) => {
        newParams.append("categoryTypeId", categoryTypeId);
      });
    } else {
      selectedCategoryTypeIds.forEach((categoryTypeId) => {
        newParams.append("categoryTypeId", categoryTypeId);
      });
    }

    router.replace(`${pathname}?${newParams.toString()}`, { scroll: false });
  };

  // Fetch category types on mount
  useEffect(() => {
    fetchRankingCategoryTypes();
  }, []);

  // Fetch categories when page, query, statuses, or categoryTypeIds change
  useEffect(() => {
    if (currentPage >= 1) {
      fetchRankingCategories(
        currentPage,
        queryParam || undefined,
        selectedStatuses,
        selectedCategoryTypeIds
      );
    }
  }, [currentPage, queryParam, selectedStatuses, selectedCategoryTypeIds]);

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
        title="Ranking Categories"
        count={totalItems}
        buttonText="Add new ranking category"
        buttonUrl="/rankings/ranking-categories/create"
      />

      <RankingCategoryTable
        categories={rankingCategories}
        categoryTypes={rankingCategoryTypes}
        loading={loading || typesLoading}
        totalItems={totalItems}
        totalPages={totalPages}
        currentPage={currentPage}
        goToNextPage={goToNextPage}
        goToPreviousPage={goToPreviousPage}
        goToPage={goToPage}
        fetchCategories={fetchRankingCategories}
        selectedStatuses={selectedStatuses}
        onStatusesChange={setSelectedStatuses}
        selectedCategoryTypeIds={selectedCategoryTypeIds}
        onCategoryTypeIdsChange={setSelectedCategoryTypeIds}
      />
    </AdminLayout>
  );
}