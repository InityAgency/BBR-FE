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


  // Koristimo generički hook za tabelu
  const {
    table,
    setGlobalFilter: setTableGlobalFilter,
  } = useTable<BrandType>({
    data: brandTypes || [],
    columns: enhancedColumns,
    initialSorting: [{ id: "updatedAt", desc: true }],
    globalFilterFn: (row, columnId, value, addMeta) => {
      // Koristimo našu univerzalnu funkciju
      const result = fuzzyFilter(row, columnId, value, addMeta);
      
      // Dodatno proveravamo ID polje eksplicitno
      const id = row.original.id || "";
      const searchValue = String(value).toLowerCase();
      
      return result || id.toLowerCase().includes(searchValue);
    },
    initialPageSize: ITEMS_PER_PAGE,
    manualPagination: true,
    pageCount: totalPages,
  });

  // Logujemo redove da vidimo šta se dešava
  useEffect(() => {
  }, [brandTypes, table]);

  // Sinhronizujemo globalFilter sa tabelom
  React.useEffect(() => {
    setTableGlobalFilter(globalFilter);
  }, [globalFilter, setTableGlobalFilter]);

  // Ako još uvek učitavamo ili nema podataka, prikažimo odgovarajuću poruku
  const showNoData = !loading && (!brandTypes || brandTypes.length === 0);

  return (
    <div className="w-full">
      {/* Filteri */}
      <BrandTypesFilters
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
      />

      {/* Kartice za mobilni prikaz */}
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

      {/* Tabela za desktop prikaz */}
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

      {/* Paginacija */}
      {!showNoData && (
        <div className="flex items-center justify-between py-4">
          <div className="text-sm text-muted-foreground mb-2 mt-3">
            Page {currentPage} of {totalPages || 1} | Total brand types: {brandTypes?.length > 0 && totalItems === 0 ? brandTypes.length : totalItems}
          </div>

          <div className="flex items-center justify-between py-4">
            <Button 
              variant="outline" 
              onClick={goToPreviousPage} 
              disabled={currentPage <= 1 || loading}
              className="mr-2"
            >
              Previous
            </Button>
            
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages || 1 }, (_, i) => (
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
              ))}
            </div>

            <Button 
              variant="outline" 
              onClick={goToNextPage} 
              disabled={currentPage >= totalPages || loading}
              className="ml-2"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
} 