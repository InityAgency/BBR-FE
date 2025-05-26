"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import AdminLayout from "../AdminLayout";
import PageHeader from "@/components/admin/Headers/PageHeader";
import { LeadsTable } from "@/components/admin/Leads/Table/LeadsTable";
import { API_BASE_URL, API_VERSION } from "@/app/constants/api";
import { Lead } from "@/app/types/models/Lead";
import { LeadsStatsCards } from "@/components/admin/Leads/Cards/LeadsStatsCards";

const ITEMS_PER_PAGE = 10;

interface LeadsApiResponse {
  data: Lead[];
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

export default function LeadsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const callInProgress = useRef(false);
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    won: 0,
    lost: 0,
    conversationRate: 0,
  });

  // Parse URL parameters directly without useState
  const currentPage = Number(searchParams.get("page")) || 1;
  const queryParam = searchParams.get("query") || "";
  const selectedStatuses = searchParams.getAll("status");

  // Create stable arrays for dependencies
  const statusesKey = selectedStatuses.sort().join(",");

  // Memoized fetch function
  const fetchLeads = useCallback(async () => {
    // Prevent duplicate calls
    if (callInProgress.current) {
      console.log("Call already in progress, skipping...");
      return;
    }
    
    callInProgress.current = true;
    console.log("fetchLeads called with:", { currentPage, queryParam, selectedStatuses });
    
    setLoading(true);
    try {
      const url = new URL(`${API_BASE_URL}/api/${API_VERSION}/leads`);
      
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

      console.log("Final URL:", url.toString());

      const response = await fetch(url.toString(), {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error fetching leads: ${response.status}`);
      }

      const data: LeadsApiResponse = await response.json();
      console.log("API Response:", data);

      if (
        typeof data.pagination.total !== "number" ||
        typeof data.pagination.totalPages !== "number" ||
        data.pagination.total < 0 ||
        data.pagination.totalPages < 0
      ) {
        throw new Error("Invalid pagination data received from server");
      }

      setLeads(data.data || []);
      setTotalPages(Math.max(1, data.pagination.totalPages));
      setTotalItems(data.pagination.total);

      // Calculate stats from fetched data
      calculateStats(data.data || []);

    } catch (error) {
      console.error("Failed to fetch leads:", error);
      setLeads([]);
      setTotalPages(1);
      setTotalItems(0);
      setStats({
        total: 0,
        new: 0,
        won: 0,
        lost: 0,
        conversationRate: 0,
      });
    } finally {
      setLoading(false);
      callInProgress.current = false;
    }
  }, [currentPage, queryParam, statusesKey]);

  // Calculate stats from current leads data
  const calculateStats = (leadsData: Lead[]) => {
    const statusCount = {
      NEW: 0,
      WON: 0,
      LOST: 0,
    };

    leadsData.forEach((lead) => {
      if (statusCount[lead.status as keyof typeof statusCount] !== undefined) {
        statusCount[lead.status as keyof typeof statusCount]++;
      }
    });

    const total = leadsData.length;
    const conversationRate =
      statusCount.WON + statusCount.LOST > 0
        ? Math.round((statusCount.WON / (statusCount.WON + statusCount.LOST)) * 100)
        : 0;

    setStats({
      total,
      new: statusCount.NEW,
      won: statusCount.WON,
      lost: statusCount.LOST,
      conversationRate,
    });
  };

  // Single useEffect with detailed debugging
  useEffect(() => {
    console.log("useEffect triggered, dependencies:", { currentPage, queryParam, statusesKey });
    fetchLeads();
  }, [fetchLeads]);

  // Centralized URL update function
  const updateUrlParams = useCallback((params: {
    page?: number;
    query?: string;
    statuses?: string[];
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

    router.replace(`${pathname}?${newParams.toString()}`, { scroll: false });
  }, [router, pathname, currentPage, queryParam, selectedStatuses]);

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

  const handleQueryChange = useCallback((query: string) => {
    updateUrlParams({ page: 1, query });
  }, [updateUrlParams]);

  return (
    <AdminLayout>
      <PageHeader
        title="Leads"
        count={totalItems}
        buttonText="Add new lead"
        buttonUrl="/leads/create"
      />

      <LeadsStatsCards stats={{
        total: stats.total,
        new: stats.new,
        contacted: 0,
        qualified: 0,
        won: stats.won,
        lost: stats.lost,
        inactive: 0,
        conversationRate: stats.conversationRate
      }} />

      <LeadsTable
        leads={leads}
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
        onQueryChange={handleQueryChange}
        updateUrlParams={updateUrlParams}
      />
    </AdminLayout>
  );
}