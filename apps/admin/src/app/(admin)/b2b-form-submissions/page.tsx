"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import AdminLayout from "../AdminLayout";
import PageHeader from "@/components/admin/Headers/PageHeader";
import { B2BFormSubmissionsTable } from "@/components/admin/B2BFormSubmissions/Table/B2BFormSubmissionsTable";
import { API_BASE_URL, API_VERSION, B2B_FORM_SUBMISSIONS } from "@/app/constants/api";
import { B2BFormSubmission } from "@/app/types/models/B2BFormSubmission";
import { B2BFormSubmissionsStatsCards } from "@/components/admin/B2BFormSubmissions/Cards/B2BFormSubmissionsStatsCards";
import { B2BFormSubmissionDetailsModal } from "@/components/admin/B2BFormSubmissions/Modals/B2BFormSubmissionDetailsModal";

const ITEMS_PER_PAGE = 10;

interface B2BFormSubmissionsApiResponse {
  data: B2BFormSubmission[];
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

export default function B2BFormSubmissionsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [submissions, setSubmissions] = useState<B2BFormSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const callInProgress = useRef(false);
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    contacted: 0,
    completed: 0,
  });
  const [selectedSubmission, setSelectedSubmission] = useState<B2BFormSubmission | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Parse URL parameters directly without useState
  const currentPage = Number(searchParams.get("page")) || 1;
  const queryParam = searchParams.get("query") || "";
  const selectedStatuses = searchParams.getAll("status");

  // Create stable arrays for dependencies
  const statusesKey = selectedStatuses.sort().join(",");

  // Memoized fetch function
  const fetchSubmissions = useCallback(async () => {
    // Prevent duplicate calls
    if (callInProgress.current) {
      console.log("Call already in progress, skipping...");
      return;
    }
    
    callInProgress.current = true;
    console.log("fetchSubmissions called with:", { currentPage, queryParam, selectedStatuses });
    
    setLoading(true);
    try {
      const url = new URL(`${API_BASE_URL}/api/${API_VERSION}${B2B_FORM_SUBMISSIONS.GET_ALL}`);
      
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
        throw new Error(`Error fetching B2B form submissions: ${response.status}`);
      }

      const data: B2BFormSubmissionsApiResponse = await response.json();
      console.log("API Response:", data);

      if (
        typeof data.pagination.total !== "number" ||
        typeof data.pagination.totalPages !== "number" ||
        data.pagination.total < 0 ||
        data.pagination.totalPages < 0
      ) {
        throw new Error("Invalid pagination data received from server");
      }

      setSubmissions(data.data || []);
      setTotalPages(Math.max(1, data.pagination.totalPages));
      setTotalItems(data.pagination.total);

      // Calculate stats from fetched data
      calculateStats(data.data || []);

    } catch (error) {
      console.error("Failed to fetch B2B form submissions:", error);
      setSubmissions([]);
      setTotalPages(1);
      setTotalItems(0);
      setStats({
        total: 0,
        new: 0,
        contacted: 0,
        completed: 0,
      });
    } finally {
      setLoading(false);
      callInProgress.current = false;
    }
  }, [currentPage, queryParam, statusesKey]);

  // Calculate stats from current submissions data
  const calculateStats = (submissionsData: B2BFormSubmission[]) => {
    const statusCount = {
      NEW: 0,
      CONTACTED: 0,
      COMPLETED: 0,
    };

    submissionsData.forEach((submission) => {
      if (statusCount[submission.status as keyof typeof statusCount] !== undefined) {
        statusCount[submission.status as keyof typeof statusCount]++;
      }
    });

    const total = submissionsData.length;

    setStats({
      total,
      new: statusCount.NEW,
      contacted: statusCount.CONTACTED,
      completed: statusCount.COMPLETED,
    });
  };

  // Single useEffect with detailed debugging
  useEffect(() => {
    console.log("useEffect triggered, dependencies:", { currentPage, queryParam, statusesKey });
    fetchSubmissions();
  }, [fetchSubmissions]);

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

  // Filter functions
  const onStatusesChange = useCallback((statuses: string[]) => {
    updateUrlParams({ statuses, page: 1 });
  }, [updateUrlParams]);

  const onQueryChange = useCallback((query: string) => {
    updateUrlParams({ query, page: 1 });
  }, [updateUrlParams]);

  // Modal functions
  const openModal = useCallback((submission: B2BFormSubmission) => {
    setSelectedSubmission(submission);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedSubmission(null);
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader
          title="B2B Form Submissions"
          count={totalItems}
        />

        {/* Stats Cards */}
        <B2BFormSubmissionsStatsCards stats={stats} />

        {/* Table */}
        <B2BFormSubmissionsTable
          submissions={submissions}
          loading={loading}
          totalItems={totalItems}
          totalPages={totalPages}
          currentPage={currentPage}
          queryParam={queryParam}
          goToNextPage={goToNextPage}
          goToPreviousPage={goToPreviousPage}
          goToPage={goToPage}
          selectedStatuses={selectedStatuses}
          onStatusesChange={onStatusesChange}
          onQueryChange={onQueryChange}
          updateUrlParams={updateUrlParams}
          onViewSubmission={openModal}
        />

        {/* Modal */}
        <B2BFormSubmissionDetailsModal
          submission={selectedSubmission}
          isOpen={isModalOpen}
          onClose={closeModal}
          onStatusChange={fetchSubmissions}
        />
      </div>
    </AdminLayout>
  );
} 