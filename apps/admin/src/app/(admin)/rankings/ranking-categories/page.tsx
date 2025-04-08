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

  // Parsiramo status iz URL parametara
  useEffect(() => {
    const statusValues = searchParams.getAll("status");
    if (statusValues.length > 0) {
      setSelectedStatuses(statusValues);
    }
  }, [searchParams]);

  // Parsiramo categoryTypeId iz URL parametara
  useEffect(() => {
    const categoryTypeIdValues = searchParams.getAll("categoryTypeId");
    if (categoryTypeIdValues.length > 0) {
      setSelectedCategoryTypeIds(categoryTypeIdValues);
    }
  }, [searchParams]);

  // Učitavamo tipove rankinga sa API-a
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
    statuses?: string[];
    categoryTypeIds?: string[];
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

    if (params.categoryTypeIds !== undefined) {
      newParams.delete("categoryTypeId");
      if (params.categoryTypeIds && params.categoryTypeIds.length > 0) {
        params.categoryTypeIds.forEach((categoryTypeId) => {
          newParams.append("categoryTypeId", categoryTypeId);
        });
      }
    }

    router.replace(`${pathname}?${newParams.toString()}`, { scroll: false });
  };

  // Efekat za učitavanje tipova
  useEffect(() => {
    fetchRankingCategoryTypes();
  }, []);

  // Efekat za ažuriranje URL-a kada se promene statusi
  useEffect(() => {
    if (selectedStatuses.length > 0) {
      updateUrlParams({ statuses: selectedStatuses, page: 1 });
    }
  }, [selectedStatuses]);

  // Efekat za ažuriranje URL-a kada se promene tipovi
  useEffect(() => {
    if (selectedCategoryTypeIds.length > 0) {
      updateUrlParams({ categoryTypeIds: selectedCategoryTypeIds, page: 1 });
    }
  }, [selectedCategoryTypeIds]);

  // Efekat za učitavanje kategorija
  useEffect(() => {
    if (currentPage >= 1) {
      fetchRankingCategories(
        currentPage,
        queryParam || undefined,
        searchParams.getAll("status"),
        searchParams.getAll("categoryTypeId")
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