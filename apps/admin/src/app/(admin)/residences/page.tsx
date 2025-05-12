"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import AdminLayout from "../AdminLayout";
import PageHeader from "@/components/admin/Headers/PageHeader";
import ResidencesTable from "@/components/admin/Residences/Table/ResidencesTable";
import { API_BASE_URL, API_VERSION } from "@/app/constants/api";
import { Residence } from "@/app/types/models/Residence";

const ITEMS_PER_PAGE = 10;

interface ResidencesApiResponse {
  data: Residence[];
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

export default function ResidencesPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [residences, setResidences] = useState<Residence[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedCityIds, setSelectedCityIds] = useState<string[]>([]);
  const [selectedCountryIds, setSelectedCountryIds] = useState<string[]>([]);

  const currentPage = Number(searchParams.get("page")) || 1;
  const queryParam = searchParams.get("query") || "";

  // Parse status, cityId, and countryId from URL parameters
  useEffect(() => {
    const statusValues = searchParams.getAll("status");
    const cityIdValues = searchParams.getAll("cityId");
    const countryIdValues = searchParams.getAll("countryId");
    
    setSelectedStatuses(statusValues);
    setSelectedCityIds(cityIdValues);
    setSelectedCountryIds(countryIdValues);
  }, [searchParams]);

  const fetchResidences = async (
    page: number,
    query?: string,
    statuses?: string[],
    cityIds?: string[],
    countryIds?: string[]
  ) => {
    setLoading(true);
    try {
      const url = new URL(`${API_BASE_URL}/api/${API_VERSION}/residences`);
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

      if (cityIds && cityIds.length > 0) {
        cityIds.forEach((cityId) => {
          url.searchParams.append("cityId", cityId);
        });
      }

      if (countryIds && countryIds.length > 0) {
        countryIds.forEach((countryId) => {
          url.searchParams.append("countryId", countryId);
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
        throw new Error(`Error fetching residences: ${response.status}`);
      }

      const data: ResidencesApiResponse = await response.json();

      const validTotal =
        typeof data.pagination.total === "number" &&
        data.pagination.total >= 0;
      const validTotalPages =
        typeof data.pagination.totalPages === "number" &&
        data.pagination.totalPages >= 0;

      if (!validTotal || !validTotalPages) {
        throw new Error("Invalid pagination data received from server");
      }

      setResidences(data.data || []);
      setTotalPages(Math.max(1, data.pagination.totalPages));
      setTotalItems(data.pagination.total);

      // Update URL to reflect the API's returned page, preserving filters
      const apiPage = data.pagination.page || page;
      if (apiPage !== page) {
        updateUrlParams({ page: apiPage });
      }
    } catch (error) {
      console.error("Failed to fetch residences:", error);
      setResidences([]);
    } finally {
      setLoading(false);
    }
  };

  const updateUrlParams = (params: {
    page?: number;
    query?: string;
    statuses?: string[];
    cityIds?: string[];
    countryIds?: string[];
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

    // Set cityIds if provided or preserve existing
    if (params.cityIds !== undefined) {
      params.cityIds.forEach((cityId) => {
        newParams.append("cityId", cityId);
      });
    } else {
      selectedCityIds.forEach((cityId) => {
        newParams.append("cityId", cityId);
      });
    }

    // Set countryIds if provided or preserve existing
    if (params.countryIds !== undefined) {
      params.countryIds.forEach((countryId) => {
        newParams.append("countryId", countryId);
      });
    } else {
      selectedCountryIds.forEach((countryId) => {
        newParams.append("countryId", countryId);
      });
    }

    router.replace(`${pathname}?${newParams.toString()}`, { scroll: false });
  };

  // Fetch residences when page, query, statuses, cityIds, or countryIds change
  useEffect(() => {
    if (currentPage >= 1) {
      fetchResidences(
        currentPage,
        queryParam || undefined,
        selectedStatuses,
        selectedCityIds,
        selectedCountryIds
      );
    }
  }, [currentPage, queryParam, selectedStatuses, selectedCityIds, selectedCountryIds]);

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
        title="Residences Management"
        count={totalItems}
        buttonText="Add new residence"
        buttonUrl="/residences/create"
      />

      <ResidencesTable
        residences={residences}
        loading={loading}
        totalItems={totalItems}
        totalPages={totalPages}
        currentPage={currentPage}
        goToNextPage={goToNextPage}
        goToPreviousPage={goToPreviousPage}
        goToPage={goToPage}
        fetchResidences={fetchResidences}
        selectedStatuses={selectedStatuses}
        onStatusesChange={setSelectedStatuses}
        selectedCityIds={selectedCityIds}
        onCityIdsChange={setSelectedCityIds}
        selectedCountryIds={selectedCountryIds}
        onCountryIdsChange={setSelectedCountryIds}
      />
    </AdminLayout>
  );
}