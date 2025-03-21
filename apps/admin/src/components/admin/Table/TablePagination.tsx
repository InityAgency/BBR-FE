// src/components/admin/Table/TablePagination.tsx
"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useTablePagination } from "@/hooks/useTablePagination";

interface TablePaginationProps {
  table: any; // TanStack table
  totalCount?: number; // Add this to support API total count
}

export function TablePagination({ table, totalCount }: TablePaginationProps) {
  const {
    pageIndex,
    startRow,
    endRow,
    totalRows,
    pageCount,
    canPreviousPage,
    canNextPage,
    previousPage,
    nextPage,
    goToPage
  } = useTablePagination({ table });

  // Use API total count if provided, otherwise use local data count
  const displayTotalRows = totalCount !== undefined ? totalCount : totalRows;
  const displayPageCount = totalCount !== undefined 
    ? Math.ceil(totalCount / table.getState().pagination.pageSize) 
    : pageCount;

  return (
    <div className="flex items-center justify-between py-4">
      <div className="text-sm text-muted-foreground">
        Showing {startRow} to {endRow} | of {displayTotalRows} results
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={previousPage}
          disabled={!canPreviousPage}
          className="h-8 px-4"
        >
          Previous
        </Button>
        {/* Numerisana paginacija */}
        <div className="flex items-center gap-1">
          {Array.from({ length: displayPageCount }, (_, i) => {
            // Za veliki broj stranica, prikazujemo samo relevantne
            const currentPage = pageIndex;
            const totalPages = displayPageCount;
            
            // Uvek prikazujemo prvu i poslednju stranicu
            // Inače prikazujemo trenutnu stranicu +/- 1 stranicu
            if (
              i === 0 || 
              i === totalPages - 1 ||
              (i >= currentPage - 1 && i <= currentPage + 1)
            ) {
              return (
                <Button
                  key={i}
                  variant={i === currentPage ? "default" : "outline"}
                  size="sm"
                  onClick={() => goToPage(i)}
                  className="h-8 w-8 p-0"
                >
                  {i + 1}
                </Button>
              );
            }
            
            // Elipsa za srednju prazninu
            if (
              (i === 1 && currentPage > 2) ||
              (i === totalPages - 2 && currentPage < totalPages - 3)
            ) {
              return <span key={i} className="px-1">...</span>;
            }
            
            return null;
          })}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={nextPage}
          disabled={!canNextPage}
          className="h-8 px-4"
        >
          Next
        </Button>
      </div>
    </div>
  );
}