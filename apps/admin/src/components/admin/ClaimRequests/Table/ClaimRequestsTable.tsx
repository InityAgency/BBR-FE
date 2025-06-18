"use client";

import React, { useEffect, useState } from "react";
import { useTable } from "@/hooks/useTable";
import { BaseTable } from "@/components/admin/Table/BaseTable";
import { ClaimRequestsFilters } from "./ClaimRequestsFilters";
import { columns } from "./ClaimRequestsColumns";
import { CellContext } from "@tanstack/react-table";
import { ClaimRequestsActions } from "./ClaimRequestsActions";
import { ClaimRequestsCardList } from "../Cards/ClaimRequestsCardList";
import { Skeleton } from "@/components/ui/skeleton";
import { ClaimRequest } from "../../../../app/types/models/ClaimRequest";
import { TablePagination } from "@/components/admin/Table/TablePagination";
import { useSearchParams } from "next/navigation";

const ITEMS_PER_PAGE = 10; // Uskladjeno sa serverskom stranom

// Popravka za kolone da koriste ClaimRequestsActions
const enhancedColumns = (fetchClaimRequests: (page: number, query?: string) => Promise<void>, currentPage: number) => columns.map(column => {
  if (column.id === "actions") {
    return {
      ...column,
      cell: (props: CellContext<ClaimRequest, unknown>) => <ClaimRequestsActions row={props.row} onUpdate={fetchClaimRequests} currentPage={currentPage} />
    };
  }
  return column;
});

const TableSkeleton = () => {
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

interface ClaimRequestsTableProps {
  requests: ClaimRequest[];
  loading: boolean;
  totalItems: number;
  totalPages: number;
  currentPage: number;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  goToPage: (page: number) => void;
  fetchClaimRequests: (page: number, query?: string) => Promise<void>;
}

export function ClaimRequestsTable({
  requests,
  loading,
  totalItems,
  totalPages,
  currentPage,
  goToNextPage,
  goToPreviousPage,
  goToPage,
  fetchClaimRequests
}: ClaimRequestsTableProps) {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('query') || '');

  // Koristimo useTable hook sa enhanced kolonama
  const tableData = useTable({
    data: requests,
    columns: enhancedColumns(fetchClaimRequests, currentPage),
  });

  // Funkcija za određivanje CSS klase za redove
  const getRowClassName = (row: { original: ClaimRequest }) => {
    const status = row.original.status;
    switch (status) {
      case 'NEW':
        return 'bg-transparent';
      case 'ACCEPTED':
        return 'bg-green-500/10';
      case 'REJECTED':
        return 'bg-red-500/10';
      default:
        return '';
    }
  };

  // Računamo efektivni broj stranica
  const effectiveTotalPages = Math.max(1, totalPages);

  return (
    <div className="w-full">
      {/* Filteri */}
      {/* <ClaimRequestsFilters
        globalFilter={search}
        setGlobalFilter={setSearch}
      /> */}

      {/* Kartice za mobilni prikaz */}
      <div className="block lg:hidden">
        {loading ? (
          <CardsSkeleton />
        ) : (
          <ClaimRequestsCardList 
            requests={tableData.table.getRowModel().rows.map(row => row.original)} 
            onUpdate={fetchClaimRequests}
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
            table={tableData.table}
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

export default ClaimRequestsTable; 