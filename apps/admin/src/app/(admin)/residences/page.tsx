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

  // Parsiramo status iz URL parametara
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
    statuses?: string[];
    cityIds?: string[];
    countryIds?: string[];
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

    if (params.cityIds !== undefined) {
      newParams.delete("cityId");
      if (params.cityIds && params.cityIds.length > 0) {
        params.cityIds.forEach((cityId) => {
          newParams.append("cityId", cityId);
        });
      }
    }

    if (params.countryIds !== undefined) {
      newParams.delete("countryId");
      if (params.countryIds && params.countryIds.length > 0) {
        params.countryIds.forEach((countryId) => {
          newParams.append("countryId", countryId);
        });
      }
    }

    router.replace(`${pathname}?${newParams.toString()}`, { scroll: false });
  };

  // Efekat za učitavanje rezidencija
  useEffect(() => {
    if (currentPage >= 1) {
      fetchResidences(
        currentPage,
        queryParam || undefined,
        searchParams.getAll("status"),
        searchParams.getAll("cityId"),
        searchParams.getAll("countryId")
      );
    }
  }, [currentPage, queryParam, searchParams]);

  // Efekat za ažuriranje URL-a kada se promene filteri
  useEffect(() => {
    if (selectedStatuses.length > 0 || selectedCityIds.length > 0 || selectedCountryIds.length > 0) {
      updateUrlParams({ 
        statuses: selectedStatuses, 
        cityIds: selectedCityIds, 
        countryIds: selectedCountryIds,
        page: 1 
      });
    }
  }, [selectedStatuses, selectedCityIds, selectedCountryIds]);

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