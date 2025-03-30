// components/admin/Amenities/Table/AmenitiesTable.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useTable } from "@/hooks/useTable";
import { BaseTable } from "@/components/admin/Table/BaseTable";
import { AmenitiesFilters } from "./AmenitiesFilters";
import { columns } from "./AmenitiesColumns";
import { fuzzyFilter } from "@/lib/tableFilters";
import { CellContext } from "@tanstack/react-table";
import { AmenitiesActions } from "./AmenitiesActions";
import { AmenitiesCardList } from "../Cards/AmenitiesCardList";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Amenity } from "../../../../app/types/models/Amenities";
const ITEMS_PER_PAGE = 10;

// Popravka za kolone da koriste AmenitiesActions
const enhancedColumns = (fetchAmenities: (page: number) => Promise<void>, currentPage: number) => columns.map(column => {
  if (column.id === "actions") {
    return {
      ...column,
      cell: (props: CellContext<Amenity, unknown>) => <AmenitiesActions row={props.row} onDelete={fetchAmenities} currentPage={currentPage} />
    };
  }
  return column;
});

// Skeleton loader za tabelu
const TableSkeleton = () => {
  return (
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

interface AmenitiesTableProps {
  amenities: Amenity[];
  loading: boolean;
  totalItems: number;
  totalPages: number;
  currentPage: number;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  goToPage: (page: number) => void;
  initialStatusFilter?: string | null;
  fetchAmenities: (page: number) => Promise<void>;
}

export function AmenitiesTable({
  amenities,
  loading,
  totalItems,
  totalPages,
  currentPage,
  goToNextPage,
  goToPreviousPage,
  goToPage,
  initialStatusFilter,
  fetchAmenities
}: AmenitiesTableProps) {
  const [search, setSearch] = useState("");

  // Koristimo generički hook za tabelu
  const {
    table,
    setGlobalFilter: setTableGlobalFilter,
  } = useTable<Amenity>({
    data: amenities,
    columns: enhancedColumns(fetchAmenities, currentPage),
    initialSorting: [{ id: "createdAt", desc: true }],
    globalFilterFn: (row, columnId, value, addMeta) => {
      // Koristimo našu univerzalnu funkciju
      const result = fuzzyFilter(row, columnId, value, addMeta);
      
      // Dodatno proveravamo ID polje eksplicitno
      const id = row.original.id || "";
      const searchValue = String(value).toLowerCase();
      
      // Vraćamo true ako je univerzalna pretraga uspela ILI ako ID sadrži traženi tekst
      return result || id.toLowerCase().includes(searchValue);
    },
    initialPageSize: ITEMS_PER_PAGE,
    manualPagination: true,
    pageCount: totalPages,
  });

  // Sinhronizujemo search sa tabelom
  React.useEffect(() => {
    setTableGlobalFilter(search);
  }, [search, setTableGlobalFilter]);

  // Helper funkcije za stilizovanje redova i ćelija
  const getRowClassName = (row: any) => {
    return "";
  };

  return (
    <div className="w-full">
      {/* Filteri */}
      <AmenitiesFilters
        globalFilter={search}
        setGlobalFilter={setSearch}
      />

      {/* Kartice za mobilni prikaz */}
      <div className="block lg:hidden">
        {loading ? (
          <CardsSkeleton />
        ) : (
          <AmenitiesCardList 
            amenities={table.getRowModel().rows.map(row => row.original)} 
            onDelete={fetchAmenities}
            currentPage={currentPage}
          />
        )}
      </div>

      {/* Tabela za desktop prikaz */}
      <div className="hidden lg:block">
        {loading ? (
          <TableSkeleton />
        ) : (
          <BaseTable 
            table={table}
            getRowClassName={getRowClassName}
          />
        )}
      </div>

      {/* Paginacija */}
      <div className="flex items-center justify-between py-4">
        <div className="text-sm text-muted-foreground mb-2 mt-3">
          Page {currentPage} of {totalPages || 1} | Total Amenities: {totalItems}
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
            {Array.from({ length: totalPages }, (_, i) => (
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
    </div>
  );
}

export default AmenitiesTable;