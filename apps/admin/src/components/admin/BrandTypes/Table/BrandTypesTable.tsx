"use client";

import React, { useState, useEffect } from "react";
import { useTable } from "@/hooks/useTable";
import { BaseTable } from "@/components/admin/Table/BaseTable";
import { BrandTypesFilters } from "./BrandTypesFilters";
import { columns } from "./BrandTypesColumns";
import { BrandType } from "@/app/types/models/BrandType";
import { fuzzyFilter } from "@/lib/tableFilters";
import { CellContext } from "@tanstack/react-table";
import { BrandTypesActions } from "./BrandTypesActions";
import { BrandTypesCardList } from "../Cards/BrandTypesCardList";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const ITEMS_PER_PAGE = 10;

// Skeleton loader za tabelu
const TableSkeleton = () => {
  return (
    <div className="w-full border rounded-md">
      {/* Skelet za header tabele */}
      <div className="border-b px-4 py-3 flex">
        <Skeleton className="h-6 w-8 rounded-md mr-2 bg-muted/20" />
        <Skeleton className="h-6 w-60 rounded-md ml-2 mr-2 bg-muted/20" />
        <Skeleton className="h-6 w-1/4 rounded-md ml-2 mr-2 bg-muted/20" />
        <Skeleton className="h-6 w-1/4 rounded-md ml-2 mr-2 bg-muted/20" />
        <Skeleton className="h-6 w-1/6 rounded-md ml-2 mr-2 bg-muted/20" />
        <Skeleton className="h-6 w-1/6 rounded-md ml-2 mr-2 bg-muted/20" />
        <Skeleton className="h-6 w-12 rounded-md ml-2 bg-muted/20" />
      </div>
      
      {/* Skelet za redove tabele */}
      {[...Array(ITEMS_PER_PAGE)].map((_, index) => (
        <div key={index} className="border-b px-4 py-3 flex items-center">
          <Skeleton className="h-6 w-8 rounded-md mr-2 bg-muted/20" />
          <Skeleton className="h-6 w-60 rounded-md ml-2 mr-2 bg-muted/20" />
          <Skeleton className="h-6 w-1/4 rounded-md ml-2 mr-2 bg-muted/20" />
          <Skeleton className="h-6 w-1/4 rounded-md ml-2 mr-2 bg-muted/20" />
          <Skeleton className="h-6 w-1/6 rounded-md ml-2 mr-2 bg-muted/20" />
          <Skeleton className="h-6 w-1/6 rounded-md ml-2 mr-2 bg-muted/20" />
          <Skeleton className="h-6 w-12 rounded-md ml-2 bg-muted/20" />
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
};

// Popravka za kolone da koriste BrandTypesActions
const enhancedColumns = columns.map(column => {
  if (column.id === "actions") {
    return {
      ...column,
      cell: (props: CellContext<BrandType, unknown>) => <BrandTypesActions row={props.row} />
    };
  }
  return column;
});

interface BrandTypesTableProps {
  brandTypes: BrandType[];
  loading: boolean;
  totalItems: number;
  totalPages: number;
  currentPage: number;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  goToPage: (page: number) => void;
}

export function BrandTypesTable({
  brandTypes,
  loading,
  totalItems,
  totalPages,
  currentPage,
  goToNextPage,
  goToPreviousPage,
  goToPage
}: BrandTypesTableProps) {
  const [globalFilter, setGlobalFilter] = useState("");

  const {
    table,
    setGlobalFilter: setTableGlobalFilter,
  } = useTable<BrandType>({
    data: brandTypes || [],
    columns: enhancedColumns,
    initialSorting: [{ id: "updatedAt", desc: true }],
    globalFilterFn: (row, columnId, value, addMeta) => {
      const result = fuzzyFilter(row, columnId, value, addMeta);
      const id = row.original.id || "";
      const searchValue = String(value).toLowerCase();
      return result || id.toLowerCase().includes(searchValue);
    },
    initialPageSize: ITEMS_PER_PAGE,
    manualPagination: true,
    pageCount: totalPages,
  });

  React.useEffect(() => {
    setTableGlobalFilter(globalFilter);
  }, [globalFilter, setTableGlobalFilter]);

  const showNoData = !loading && (!brandTypes || brandTypes.length === 0);

  // Generate page numbers for pagination
  const renderPageNumbers = () => {
    const effectiveTotalPages = Math.max(1, totalPages);
    
    if (effectiveTotalPages <= 5) {
      return Array.from({ length: effectiveTotalPages }, (_, i) => (
        <Button
          key={i}
          variant={currentPage === i + 1 ? "default" : "outline"}
          size="sm"
          className="w-8 h-8"
          onClick={() => goToPage(i + 1)}
          disabled={loading}
        >
          {i + 1}
        </Button>
      ));
    }

    const pageNumbers = [];

    // Always show first page
    pageNumbers.push(
      <Button
        key={1}
        variant={currentPage === 1 ? "default" : "outline"}
        size="sm"
        className="w-8 h-8"
        onClick={() => goToPage(1)}
        disabled={loading}
      >
        1
      </Button>
    );

    // Show ellipsis if current page is not near the beginning
    if (currentPage > 3) {
      pageNumbers.push(
        <span key="startEllipsis" className="px-1">...</span>
      );
    }

    // Show pages around current page
    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(effectiveTotalPages - 1, currentPage + 1);

    for (let i = startPage; i <= endPage; i++) {
      if (i !== 1 && i !== effectiveTotalPages) {
        pageNumbers.push(
          <Button
            key={i}
            variant={currentPage === i ? "default" : "outline"}
            size="sm"
            className="w-8 h-8"
            onClick={() => goToPage(i)}
            disabled={loading}
          >
            {i}
          </Button>
        );
      }
    }

    // Show ellipsis if current page is not near the end
    if (currentPage < effectiveTotalPages - 2) {
      pageNumbers.push(
        <span key="endEllipsis" className="px-1">...</span>
      );
    }

    // Always show last page if there are multiple pages
    if (effectiveTotalPages > 1) {
      pageNumbers.push(
        <Button
          key={effectiveTotalPages}
          variant={currentPage === effectiveTotalPages ? "default" : "outline"}
          size="sm"
          className="w-8 h-8"
          onClick={() => goToPage(effectiveTotalPages)}
          disabled={loading}
        >
          {effectiveTotalPages}
        </Button>
      );
    }

    return pageNumbers;
  };

  const effectiveTotalPages = Math.max(1, totalPages);

  return (
    <div className="w-full">
      <BrandTypesFilters
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
      />

      <div className="block lg:hidden">
        {loading ? (
          <CardsSkeleton />
        ) : showNoData ? (
          <div className="text-center py-8 text-muted-foreground">
            No brand types found
          </div>
        ) : (
          <BrandTypesCardList brandTypes={table.getRowModel().rows.map(row => row.original)} />
        )}
      </div>

      <div className="hidden lg:block">
        {loading ? (
          <TableSkeleton />
        ) : showNoData ? (
          <div className="text-center py-8 text-muted-foreground border rounded-md">
            No brand types found
          </div>
        ) : (
          <BaseTable 
            table={table}
          />
        )}
      </div>

      {!showNoData && (
        <div className="flex flex-col md:flex-row items-center justify-between py-4 gap-4">
          <div className="text-sm text-muted-foreground">
            Page {currentPage} of {effectiveTotalPages} | Total brand types: {brandTypes?.length > 0 && totalItems === 0 ? brandTypes.length : totalItems}
          </div>

          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              onClick={goToPreviousPage} 
              disabled={currentPage <= 1 || loading}
            >
              Previous
            </Button>
            
            <div className="flex items-center space-x-1">
              {renderPageNumbers()}
            </div>

            <Button 
              variant="outline" 
              onClick={goToNextPage} 
              disabled={currentPage >= effectiveTotalPages || loading}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
} 