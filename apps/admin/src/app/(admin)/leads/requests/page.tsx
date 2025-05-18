"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
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
  const callInProgress = useRef(false);

  // Parse URL parameters
  const currentPage = Number(searchParams.get("page")) || 1;
  const queryParam = searchParams.get("query") || "";
  const selectedStatuses = searchParams.getAll("status");
  const selectedTypes = searchParams.getAll("type");

  // Create stable arrays for dependencies
  const statusesKey = selectedStatuses.sort().join(",");
  const typesKey = selectedTypes.sort().join(",");

  // Memoized fetch function
  const fetchRequests = useCallback(async () => {
    // Prevent duplicate calls
    if (callInProgress.current) {
      console.log("Call already in progress, skipping...");
      return;
    }
    
    callInProgress.current = true;
    console.log("fetchRequests called with:", { currentPage, queryParam, selectedStatuses, selectedTypes });
    
    setLoading(true);
    try {
      const url = new URL(`${API_BASE_URL}/api/${API_VERSION}/requests`);
      
      // Add sorting parameters first
      url.searchParams.set("sortBy", "createdAt");
      url.searchParams.set("sortOrder", "desc");
      
      // Add pagination
      url.searchParams.set("limit", ITEMS_PER_PAGE.toString());
      url.searchParams.set("page", currentPage.toString());

      // Add search query
      if (queryParam && queryParam.trim() !== "") {
        url.searchParams.set("query", queryParam);
      }

      // Add status filters
      selectedStatuses.forEach((status) => {
        url.searchParams.append("status", status);
      });

      // Add type filters
      selectedTypes.forEach((type) => {
        url.searchParams.append("type", type);
      });

      console.log("Final URL:", url.toString());

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
      console.log("API Response:", data);

      if (
        typeof data.pagination.total !== "number" ||
        typeof data.pagination.totalPages !== "number" ||
        data.pagination.total < 0 ||
        data.pagination.totalPages < 0
      ) {
        throw new Error("Invalid pagination data received from server");
      }

      setRequests(data.data || []);
      setTotalPages(Math.max(1, data.pagination.totalPages));
      setTotalItems(data.pagination.total);

    } catch (error) {
      console.error("Failed to fetch requests:", error);
      setRequests([]);
      setTotalPages(1);
      setTotalItems(0);
    } finally {
      setLoading(false);
      callInProgress.current = false;
    }
  }, [currentPage, queryParam, statusesKey, typesKey]); // Use stable keys instead of arrays

  // Single useEffect with detailed debugging
  useEffect(() => {
    console.log("useEffect triggered, dependencies:", { currentPage, queryParam, statusesKey, typesKey });
    fetchRequests();
  }, [fetchRequests]);

  // Centralized URL update function
  const updateUrlParams = useCallback((params: {
    page?: number;
    query?: string;
    statuses?: string[];
    types?: string[];
  }) => {
    const newParams = new URLSearchParams();

    // Set page
    newParams.set("page", (params.page ?? currentPage).toString());

    // Set query
    const query = params.query !== undefined ? params.query : queryParam;
    if (query && query.trim() !== "") {
      newParams.set("query", query);
    }

    // Set statuses
    const statuses = params.statuses !== undefined ? params.statuses : selectedStatuses;
    statuses.forEach((status) => {
      newParams.append("status", status);
    });

    // Set types
    const types = params.types !== undefined ? params.types : selectedTypes;
    types.forEach((type) => {
      newParams.append("type", type);
    });

    router.replace(`${pathname}?${newParams.toString()}`, { scroll: false });
  }, [router, pathname, currentPage, queryParam, selectedStatuses, selectedTypes]);

  // Navigation functions
  const goToNextPage = useCallback(() => {
    if (currentPage < totalPages) {
      updateUrlParams({ page: currentPage + 1 });
    }
  }, [currentPage, totalPages, updateUrlParams]);

  const goToPreviousPage = useCallback(() => {
    if (currentPage > 1) {
      updateUrlParams({ page: currentPage - 1 });
    }
  }, [currentPage, updateUrlParams]);

  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages) {
      updateUrlParams({ page });
    }
  }, [totalPages, updateUrlParams]);

  // Filter handlers with correct types
  const handleStatusesChange = useCallback((statuses: string[]) => {
    updateUrlParams({ page: 1, statuses });
  }, [updateUrlParams]);

  const handleTypesChange = useCallback((types: string[]) => {
    updateUrlParams({ page: 1, types });
  }, [updateUrlParams]);

  const handleQueryChange = useCallback((query: string) => {
    updateUrlParams({ page: 1, query });
  }, [updateUrlParams]);

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
        queryParam={queryParam}
        goToNextPage={goToNextPage}
        goToPreviousPage={goToPreviousPage}
        goToPage={goToPage}
        selectedStatuses={selectedStatuses}
        onStatusesChange={handleStatusesChange}
        selectedTypes={selectedTypes}
        onTypesChange={handleTypesChange}
        onQueryChange={handleQueryChange}
        updateUrlParams={updateUrlParams}
      />
    </AdminLayout>
  );
}