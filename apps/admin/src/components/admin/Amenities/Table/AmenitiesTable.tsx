// components/admin/Amenities/Table/AmenitiesTable.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useTable } from "@/hooks/useTable";
import { BaseTable } from "@/components/admin/Table/BaseTable";
import { AmenitiesFilters } from "./AmenitiesFilters";
import { columns } from "./AmenitiesColumns";
import { CellContext } from "@tanstack/react-table";
import { AmenitiesActions } from "./AmenitiesActions";
import { AmenitiesCardList } from "../Cards/AmenitiesCardList";
import { Skeleton } from "@/components/ui/skeleton";
import { Amenity } from "../../../../app/types/models/Amenities";
import { TablePagination } from "@/components/admin/Table/TablePagination";
import { useSearchParams } from "next/navigation";

const ITEMS_PER_PAGE = 10; // Uskladjeno sa serverskom stranom

// Popravka za kolone da koriste AmenitiesActions
const enhancedColumns = (fetchAmenities: (page: number, query?: string) => Promise<void>, currentPage: number) => columns.map(column => {
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
  fetchAmenities: (page: number, query?: string) => Promise<void>;
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
  const searchParams = useSearchParams();
  const queryParam = searchParams.get('query');
  const [search, setSearch] = useState(queryParam || "");
  const [calculatedTotalPages, setCalculatedTotalPages] = useState(totalPages);

  // Update calculatedTotalPages when totalItems or totalPages changes
  useEffect(() => {
    setCalculatedTotalPages(totalPages);
  }, [totalItems, totalPages]);

  // Koristimo generički hook za tabelu
  const {
    table,
    setGlobalFilter: setTableGlobalFilter,
  } = useTable<Amenity>({
    data: amenities,
    columns: enhancedColumns(fetchAmenities, currentPage),
    initialSorting: [{ id: "createdAt", desc: true }],
    // Ne možemo koristiti manualFiltering jer nije podržano u useTable custom hooku
    // Umesto toga, potpuno ćemo zaobići lokalno filtriranje
    initialPageSize: ITEMS_PER_PAGE,
    manualPagination: true,
    pageCount: totalPages,
  });

  // Sinhronizujemo stanje sa URL parametrom
  useEffect(() => {
    if (queryParam !== search) {
      setSearch(queryParam || "");
    }
  }, [queryParam]);

  // Helper funkcije za stilizovanje redova i ćelija
  const getRowClassName = (row: any) => {
    return "";
  };

  const effectiveTotalPages = Math.max(1, totalPages);

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

      <TablePagination
        currentPage={currentPage}
        totalPages={effectiveTotalPages}
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

export default AmenitiesTable;