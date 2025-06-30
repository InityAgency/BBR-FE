"use client";

import React from "react";
import { useTable } from "@/hooks/useTable";
import { BaseTable } from "@/components/web/Table/BaseTable";
import { columns } from "./RankingColumns";
import { RankingCardList } from "../Cards/RankingCardList";
import { Skeleton } from "@/components/ui/skeleton";
import { TablePagination } from "@/components/web/Table/TablePagination";

const ITEMS_PER_PAGE = 10;

interface RankingRow {
  residenceName: string;
  rankingCategory: string;
  position: number;
  score: number;
  residenceId: string;
  residenceSlug: string;
  rankingCategorySlug: string;
  previousPosition: number | null;
  previousScore: number;
}

// Table skeleton loader
const TableSkeleton = () => {
  return (
    <div className="w-full border rounded-md">
      <div className="border-b px-4 py-3 flex">
        <Skeleton className="h-6 w-1/4 rounded-md mr-2 bg-muted/20" />
        <Skeleton className="h-6 w-1/4 rounded-md ml-2 mr-2 bg-muted/20" />
        <Skeleton className="h-6 w-1/6 rounded-md ml-2 mr-2 bg-muted/20" />
        <Skeleton className="h-6 w-1/6 rounded-md ml-2 mr-2 bg-muted/20" />
        <Skeleton className="h-6 w-20 rounded-md ml-2 bg-muted/20" />
      </div>
      {[...Array(ITEMS_PER_PAGE)].map((_, index) => (
        <div key={index} className="border-b px-4 py-3 flex items-center">
          <Skeleton className="h-6 w-1/4 rounded-md mr-2 bg-muted/20" />
          <Skeleton className="h-6 w-1/4 rounded-md ml-2 mr-2 bg-muted/20" />
          <Skeleton className="h-6 w-1/6 rounded-md ml-2 mr-2 bg-muted/20" />
          <Skeleton className="h-6 w-1/6 rounded-md ml-2 mr-2 bg-muted/20" />
          <Skeleton className="h-6 w-20 rounded-md ml-2 bg-muted/20" />
        </div>
      ))}
    </div>
  );
};

const CardsSkeleton = () => {
  return (
    <div className="space-y-4">
      {[...Array(ITEMS_PER_PAGE)].map((_, index) => (
        <div key={index} className="border rounded-md p-4 space-y-3">
          <div className="flex justify-between items-start">
            <Skeleton className="h-6 w-48 rounded-md bg-muted/20" />
            <Skeleton className="h-6 w-16 rounded-md bg-muted/20" />
          </div>
          <Skeleton className="h-5 w-32 rounded-md bg-muted/20" />
          <Skeleton className="h-5 w-24 rounded-md bg-muted/20" />
          <div className="flex items-center justify-between mt-4">
            <Skeleton className="h-8 w-24 rounded-md bg-muted/20" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-8 rounded-md bg-muted/20" />
              <Skeleton className="h-8 w-8 rounded-md bg-muted/20" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

interface RankingTableProps {
  rankings: RankingRow[];
  loading: boolean;
  totalItems: number;
  totalPages: number;
  currentPage: number;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  goToPage: (page: number) => void;
}

export function RankingTable({
  rankings,
  loading,
  totalItems,
  totalPages,
  currentPage,
  goToNextPage,
  goToPreviousPage,
  goToPage,
}: RankingTableProps) {

  // Table setup with columns
  const { table } = useTable<RankingRow>({
    data: rankings,
    columns: columns,
    initialPageSize: ITEMS_PER_PAGE,
    manualPagination: true,
    pageCount: totalPages,
    enableSorting: false,
    initialSorting: [],
  });

  return (
    <div className="w-full">
      {/* Cards for mobile view */}
      <div className="block lg:hidden">
        {loading ? (
          <CardsSkeleton />
        ) : (
          <RankingCardList rankings={table.getRowModel().rows.map(row => row.original)} />
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
    </div>
  );
}