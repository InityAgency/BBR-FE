"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import AdminLayout from "../../AdminLayout";
import PageHeader from "@/components/admin/Headers/PageHeader";
import { RequestsTable } from "@/components/admin/Requests/Table/RequestsTable";
import { API_BASE_URL, API_VERSION } from "@/app/constants/api";
import { Request, RequestsApiResponse } from "@/app/types/models/Request";

const ITEMS_PER_PAGE = 10;

export default function LeadsRequestPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const currentPage = Number(searchParams.get("page")) || 1;
  const queryParam = searchParams.get("query") || "";

  // Parse status and type from URL parameters
  useEffect(() => {
    const statusValues = searchParams.getAll("status");
    const typeValues = searchParams.getAll("type");
    setSelectedStatuses(statusValues);
    setSelectedTypes(typeValues);
  }, [searchParams]);

  const fetchRequests = async (
    page: number,
    query?: string,
    statuses?: string[],
    types?: string[]
  ) => {
    setLoading(true);
    try {
      const url = new URL(`${API_BASE_URL}/api/${API_VERSION}/requests`);
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

      if (types && types.length > 0) {
        types.forEach((type) => {
          url.searchParams.append("type", type);
        });
      }

      const response = await fetch(url.toString(), {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error fetching requests: ${response.status}`);
      }

      const data: RequestsApiResponse = await response.json();

      const validTotal =
        typeof data.pagination.total === "number" &&
        data.pagination.total >= 0;
      const validTotalPages =
        typeof data.pagination.totalPages === "number" &&
        data.pagination.totalPages >= 0;

      if (!validTotal || !validTotalPages) {
        throw new Error("Invalid pagination data received from server");
      }

      setRequests(data.data || []);
      setTotalPages(Math.max(1, data.pagination.totalPages));
      setTotalItems(data.pagination.total);

      // Update URL to reflect the API's returned page, preserving filters
      const apiPage = data.pagination.page || page;
      if (apiPage !== page) {
        updateUrlParams({ page: apiPage });
      }
    } catch (error) {
      console.error("Failed to fetch requests:", error);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const updateUrlParams = (params: {
    page?: number;
    query?: string;
    statuses?: string[];
    types?: string[];
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

    // Set types if provided or preserve existing
    if (params.types !== undefined) {
      params.types.forEach((type) => {
        newParams.append("type", type);
      });
    } else {
      selectedTypes.forEach((type) => {
        newParams.append("type", type);
      });
    }

    router.replace(`${pathname}?${newParams.toString()}`, { scroll: false });
  };

  // Fetch requests when page, query, statuses, or types change
  useEffect(() => {
    if (currentPage >= 1) {
      fetchRequests(
        currentPage,
        queryParam || undefined,
        selectedStatuses,
        selectedTypes
      );
    }
  }, [currentPage, queryParam, selectedStatuses, selectedTypes]);

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
        title="Requests"
        count={totalItems}
      />

      <RequestsTable
        requests={requests}
        loading={loading}
        totalItems={totalItems}
        totalPages={totalPages}
        currentPage={currentPage}
        goToNextPage={goToNextPage}
        goToPreviousPage={goToPreviousPage}
        goToPage={goToPage}
        selectedStatuses={selectedStatuses}
        onStatusesChange={setSelectedStatuses}
        selectedTypes={selectedTypes}
        onTypesChange={setSelectedTypes}
        fetchRequests={fetchRequests}
      />
    </AdminLayout>
  );
}
