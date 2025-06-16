"use client";

import React from "react";
import { useTable } from "@/hooks/useTable";
import { BaseTable } from "@/components/web/Table/BaseTable";
import { columns } from "./BillingColumns";
import { BillingTransaction } from "@/types/billing";
import { BillingCardList } from "../Cards/BillingCardList";
import { Skeleton } from "@/components/ui/skeleton";
import { TablePagination } from "@/components/web/Table/TablePagination";

const ITEMS_PER_PAGE = 10;

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

// Cards skeleton loader
const CardsSkeleton = () => {
  return (
    <div className="space-y-4">
      {[...Array(ITEMS_PER_PAGE)].map((_, index) => (
        <div key={index} className="border rounded-md p-4 space-y-3">
          <div className="flex justify-between items-center">
            <Skeleton className="h-6 w-32 rounded-md bg-muted/20" />
            <Skeleton className="h-6 w-20 rounded-md bg-muted/20" />
          </div>
          <Skeleton className="h-4 w-40 rounded-md bg-muted/20" />
          <Skeleton className="h-4 w-32 rounded-md bg-muted/20" />
          <Skeleton className="h-8 w-full rounded-md bg-muted/20" />
        </div>
      ))}
    </div>
  );
};

interface BillingTableProps {
  transactions: BillingTransaction[];
  loading: boolean;
  totalItems: number;
  totalPages: number;
  currentPage: number;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  goToPage: (page: number) => void;
}

export function BillingTable({
  transactions,
  loading,
  totalItems,
  totalPages,
  currentPage,
  goToNextPage,
  goToPreviousPage,
  goToPage,
}: BillingTableProps) {
  const { table } = useTable<BillingTransaction>({
    data: transactions,
    columns: columns,
    initialPageSize: ITEMS_PER_PAGE,
    manualPagination: true,
    pageCount: totalPages,
    enableSorting: false,
    initialSorting: [],
  });

  return (
    <div className="w-full space-y-4">
      {/* Cards for mobile view */}
      <div className="block lg:hidden">
        {loading ? (
          <CardsSkeleton />
        ) : (
          <BillingCardList transactions={table.getRowModel().rows.map(row => row.original)} />
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