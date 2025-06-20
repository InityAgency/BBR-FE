"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import ReviewsTable from "@/components/admin/Reviews/Table/ReviewsTable";
import { reviewsService } from "@/lib/api/services/reviews.service";
import { Review } from "@/app/types/models/Review";

const ITEMS_PER_PAGE = 10;

interface ReviewsApiResponse {
  data: Review[];
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

interface ResidenceReviewsProps {
  residenceId: string;
}

export function ResidenceReviews({ residenceId }: ResidenceReviewsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Parse search params using useMemo
  const { page, statuses } = useMemo(() => {
    const page = Number(searchParams.get("page")) || 1;
    const statusesParam = searchParams.getAll("status");
    const statuses = statusesParam || [];
    
    return { page, statuses };
  }, [searchParams]);

  const fetchReviews = useCallback(async (page: number, statuses?: string[]) => {
    try {
      setLoading(true);
      setError(null);

      const params: any = {
        residenceId,
        page,
        limit: ITEMS_PER_PAGE,
      };

      if (statuses && statuses.length > 0) {
        params.statuses = statuses.join(",");
      }

      const response = await reviewsService.getReviews(params);
      
      setReviews(response.data || []);
      setTotalItems(response.pagination?.total || 0);
      setTotalPages(response.pagination?.totalPages || 1);
      setCurrentPage(response.pagination?.page || 1);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setError("Failed to load reviews");
      setReviews([]);
      setTotalItems(0);
      setTotalPages(1);
      setCurrentPage(1);
    } finally {
      setLoading(false);
    }
  }, [residenceId]);

  const updateUrlParams = useCallback((params: {
    page?: number;
    statuses?: string[];
  }) => {
    const urlParams = new URLSearchParams();
    
    // Add current params
    const currentPage = searchParams.get("page");
    const currentStatuses = searchParams.getAll("status");
    
    if (currentPage && !params.page) urlParams.set("page", currentPage);
    if (currentStatuses.length > 0 && !params.statuses) {
      currentStatuses.forEach(status => urlParams.append("status", status));
    }
    
    // Add new params
    if (params.page !== undefined) {
      urlParams.set("page", params.page.toString());
    }
    
    if (params.statuses !== undefined) {
      if (params.statuses.length > 0) {
        params.statuses.forEach(status => urlParams.append("status", status));
      }
    }
    
    router.push(`${pathname}?${urlParams.toString()}`, { scroll: false });
  }, [searchParams, pathname, router]);

  useEffect(() => {
    setCurrentPage(page);
    setSelectedStatuses(statuses);
    fetchReviews(page, statuses);
  }, [page, statuses, fetchReviews]);

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

  if (error) {
    return (
      <div className="w-full">
        <div className="flex items-center justify-between w-full mb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-sans">Reviews</h1>
          </div>
        </div>
        <div className="rounded-md border p-4 text-center">
          <p className="text-muted-foreground">Error loading reviews: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between w-full mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-sans">Reviews</h1>
        </div>
      </div>

      <ReviewsTable
        reviews={reviews}
        loading={loading}
        totalItems={totalItems}
        totalPages={totalPages}
        currentPage={currentPage}
        goToNextPage={goToNextPage}
        goToPreviousPage={goToPreviousPage}
        goToPage={goToPage}
        selectedStatuses={selectedStatuses}
        onStatusesChange={setSelectedStatuses}
        fetchReviews={fetchReviews}
      />
    </div>
  );
} 