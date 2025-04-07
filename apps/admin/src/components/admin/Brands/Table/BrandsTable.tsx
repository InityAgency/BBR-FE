// components/admin/Brands/Table/BrandsTable.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useTable } from "@/hooks/useTable";
import { useTableFilters } from "@/hooks/useTableFilters";
import { BaseTable } from "@/components/admin/Table/BaseTable";
import { BrandsFilters } from "./BrandsFilters";
import { columns } from "./BrandsColumns";
import { Brand } from "../../../../app/types/models/Brand";
import { fuzzyFilter } from "@/lib/tableFilters";
import { CellContext } from "@tanstack/react-table";
import { BrandsActions } from "./BrandsActions";
import { BrandsCardList } from "../Cards/BrandsCardList";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { TablePagination } from "@/components/admin/Table/TablePagination";
import { useSearchParams } from "next/navigation";

const ITEMS_PER_PAGE = 10;

interface BrandType {
  id: string;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Popravka za kolone da koriste BrandsActions
const enhancedColumns = (fetchBrands: (page: number, query?: string, statuses?: string[], brandTypeIds?: string[]) => Promise<void>, currentPage: number) => columns.map(column => {
  if (column.id === "actions") {
    return {
      ...column,
      cell: (props: CellContext<Brand, unknown>) => <BrandsActions row={props.row} onDelete={fetchBrands} currentPage={currentPage} />
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

interface BrandsTableProps {
  brands: Brand[];
  brandTypes: BrandType[];
  loading: boolean;
  totalItems: number;
  totalPages: number;
  currentPage: number;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  goToPage: (page: number) => void;
  selectedStatuses: string[];
  onStatusesChange: React.Dispatch<React.SetStateAction<string[]>>;
  selectedBrandTypeIds: string[];
  onBrandTypeIdsChange: React.Dispatch<React.SetStateAction<string[]>>;
  fetchBrands: (page: number, query?: string, statuses?: string[], brandTypeIds?: string[]) => Promise<void>;
}

export function BrandsTable({
  brands,
  brandTypes = [],
  loading,
  totalItems,
  totalPages,
  currentPage,
  goToNextPage,
  goToPreviousPage,
  goToPage,
  selectedStatuses,
  onStatusesChange,
  selectedBrandTypeIds,
  onBrandTypeIdsChange,
  fetchBrands
}: BrandsTableProps) {
  const searchParams = useSearchParams();
  const queryParam = searchParams.get('query');
  const [search, setSearch] = useState(queryParam || "");

  // Koristimo generički hook za tabelu
  const {
    table,
    setGlobalFilter: setTableGlobalFilter,
  } = useTable<Brand>({
    data: brands,
    columns: enhancedColumns(fetchBrands, currentPage),
    initialSorting: [{ id: "registeredAt", desc: true }],
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

  // Sinhronizujemo globalFilter sa tabelom
  React.useEffect(() => {
    setTableGlobalFilter(search);
  }, [search, setTableGlobalFilter]);

  const {
    locationSearchValue: typeSearchValue,
    setLocationSearchValue: setTypeSearchValue,
    uniqueStatuses,
  } = useTableFilters<Brand>({
    table,
    data: brands,
    locationAccessor: "brandType",
    statusAccessor: "status",
    useNestedFilter: true,
    nestedField: "name"
  });

  // Sinhronizujemo stanje sa URL parametrom
  useEffect(() => {
    if (queryParam !== search) {
      setSearch(queryParam || "");
    }
  }, [queryParam]);

  // Helper funkcije za stilizovanje redova i ćelija
  const getRowClassName = (row: any) => {
    const status = row.original.status;
    if (status === "DELETED") return "opacity-60";
    if (status === "DRAFT") return "opacity-80";
    return "";
  };

  return (
    <div className="w-full">
      {/* Filteri */}
      <BrandsFilters
        globalFilter={search}
        setGlobalFilter={setSearch}
        selectedBrandTypeIds={selectedBrandTypeIds}
        setSelectedBrandTypeIds={onBrandTypeIdsChange}
        selectedStatuses={selectedStatuses}
        setSelectedStatuses={onStatusesChange}
        brandTypes={brandTypes}
        uniqueStatuses={uniqueStatuses}
        typeSearchValue={typeSearchValue}
        setTypeSearchValue={setTypeSearchValue}
      />

      {/* Kartice za mobilni prikaz */}
      <div className="block lg:hidden">
        {loading ? (
          <CardsSkeleton />
        ) : (
          <BrandsCardList brands={table.getRowModel().rows.map(row => row.original)} />
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

export default BrandsTable;