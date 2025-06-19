"use client";

import React, { useEffect, useState } from "react";
import { useTable } from "@/hooks/useTable";
import { BaseTable } from "@/components/admin/Table/BaseTable";
import { ReviewsFilters } from "./ReviewsFilters";
import { columns } from "./ReviewsColumns";
import { Review } from "@/app/types/models/Review";
import { fuzzyFilter } from "@/lib/tableFilters";
import { CellContext } from "@tanstack/react-table";
import { ReviewsActions } from "./ReviewsActions";
import { ReviewsCardList } from "../Cards/ReviewsCardList";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { TablePagination } from "@/components/admin/Table/TablePagination";
import { useSearchParams } from "next/navigation";
import { ReviewDetailsModal } from "../Modal/ReviewDetailsModal";

const ITEMS_PER_PAGE = 10;

// Popravka za kolone da koriste ReviewsActions
const enhancedColumns = (fetchReviews: (page: number, statuses?: string[]) => Promise<void>, currentPage: number, onViewDetails: (review: Review) => void) => columns.map(column => {
  if (column.id === "actions") {
    return {
      ...column,
      cell: (props: CellContext<Review, unknown>) => (
        <ReviewsActions 
          row={props.row}
          onRefresh={() => fetchReviews(currentPage)}
          onViewDetails={onViewDetails} currentPage={0}        />
      )
    }
  }
  return column;
});

// Skeleton komponente
const TableSkeleton = () => (
  <div className="w-full border rounded-md">
    {/* Skelet za header tabele */}
    <div className="border-b px-4 py-3 flex">
      <Skeleton className="h-6 w-8 rounded-md mr-2 bg-muted/20" />
      <Skeleton className="h-6 w-1/4 rounded-md ml-2 mr-2 bg-muted/20" />
      <Skeleton className="h-6 w-1/6 rounded-md ml-2 mr-2 bg-muted/20" />
      <Skeleton className="h-6 w-1/6 rounded-md ml-2 mr-2 bg-muted/20" />
      <Skeleton className="h-6 w-1/6 rounded-md ml-2 mr-2 bg-muted/20" />
      <Skeleton className="h-6 w-1/6 rounded-md ml-2 mr-2 bg-muted/20" />
      <Skeleton className="h-6 w-40 rounded-md ml-2 bg-muted/20" />
    </div>
    
    {/* Skelet za redove tabele */}
    {[...Array(ITEMS_PER_PAGE)].map((_, index) => (
      <div key={index} className="border-b px-4 py-3 flex items-center">
        <Skeleton className="h-6 w-8 rounded-md mr-2 bg-muted/20" />
        <Skeleton className="h-6 w-1/4 rounded-md ml-2 mr-2 bg-muted/20" />
        <Skeleton className="h-6 w-1/6 rounded-md ml-2 mr-2 bg-muted/20" />
        <Skeleton className="h-6 w-1/6 rounded-md ml-2 mr-2 bg-muted/20" />
        <Skeleton className="h-6 w-1/6 rounded-md ml-2 mr-2 bg-muted/20" />
        <Skeleton className="h-6 w-1/6 rounded-md ml-2 mr-2 bg-muted/20" />
        <Skeleton className="h-6 w-40 rounded-md ml-2 bg-muted/20" />
      </div>
    ))}
  </div>
);

const CardsSkeleton = () => (
  <div className="space-y-4">
    {[...Array(ITEMS_PER_PAGE)].map((_, index) => (
      <div key={index} className="border rounded-md p-4 space-y-3">
        <div className="flex justify-between mt-3">
          <Skeleton className="h-8 w-32 rounded-md bg-muted/20" />
          <Skeleton className="h-8 w-20 rounded-md bg-muted/20" />
        </div>
        <div className="flex justify-between mt-3 mb-3">
          <Skeleton className="h-8 w-80 rounded-md bg-muted/20" />
          <Skeleton className="h-8 w-20 rounded-md bg-muted/20" />
        </div>
        <Skeleton className="h-8 w-60 rounded-md bg-muted/20" />
        <div className="flex items-center space-x-2 mt-4">
          <Skeleton className="h-8 w-1/2 rounded-md bg-muted/20" />
          <Skeleton className="h-8 w-1/2 rounded-md bg-muted/20" />
        </div>
      </div>
    ))}
  </div>
);

interface ReviewsTableProps {
  reviews: Review[];
  loading: boolean;
  totalItems: number;
  totalPages: number;
  currentPage: number;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  goToPage: (page: number) => void;
  selectedStatuses: string[];
  onStatusesChange: React.Dispatch<React.SetStateAction<string[]>>;
  fetchReviews: (page: number, statuses?: string[]) => Promise<void>;
}

export default function ReviewsTable({
  reviews,
  loading,
  totalItems,
  totalPages,
  currentPage,
  goToNextPage,
  goToPreviousPage,
  goToPage,
  selectedStatuses,
  onStatusesChange,
  fetchReviews,
}: ReviewsTableProps) {
  const searchParams = useSearchParams();
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Table setup
  const { table } = useTable<Review>({
    data: reviews,
    columns: enhancedColumns(fetchReviews, currentPage, handleViewDetails),
    initialPageSize: ITEMS_PER_PAGE,
    manualPagination: true,
    pageCount: totalPages,
    enableSorting: true,
    initialSorting: [],
    globalFilterFn: fuzzyFilter,
  });

  // Get unique statuses from reviews
  const uniqueStatuses = React.useMemo(() => {
    const statuses = new Set<string>();
    reviews.forEach((review) => {
      statuses.add(review.status);
    });
    return Array.from(statuses).sort();
  }, [reviews]);

  function handleViewDetails(review: Review) {
    setSelectedReview(review);
    setIsModalOpen(true);
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <ReviewsFilters
        selectedStatuses={selectedStatuses}
        setSelectedStatuses={onStatusesChange}
        uniqueStatuses={uniqueStatuses}
      />

      {/* Cards for mobile view */}
      <div className="block lg:hidden">
        {loading ? (
          <CardsSkeleton />
        ) : (
          <ReviewsCardList 
            reviews={reviews}
            onViewDetails={handleViewDetails}
          />
        )}
      </div>

      {/* Table for desktop view */}
      <div className="hidden lg:block">
        {loading ? (
          <TableSkeleton />
        ) : (
          <BaseTable table={table} />
        )}
      </div>

      {/* Pagination */}
      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={ITEMS_PER_PAGE}
        goToNextPage={goToNextPage}
        goToPreviousPage={goToPreviousPage}
        goToPage={goToPage}
        loading={loading}
      />

      {/* Review Details Modal */}
      <ReviewDetailsModal
        review={selectedReview}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedReview(null);
        }}
        onStatusChange={() => {
          // Osveži tabelu nakon promene statusa
          fetchReviews(currentPage, selectedStatuses);
        }}
      />
    </div>
  );
}