"use client";

import { useTable } from "@/hooks/useTable";
import { BaseTable } from "@/components/web/Table/BaseTable";
import { columns } from "@/components/web/Leads/Table/LeadsColumns";
import { LeadsCardList } from "@/components/web/Leads/Cards/LeadsCardList";
import { TablePagination } from "@/components/web/Table/TablePagination";
import { Skeleton } from "@/components/ui/skeleton";
import { Lead } from "@/types/lead";
import { useResidenceLeads } from "@/hooks/useResidenceLeads";

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

const CardsSkeleton = () => {
  return (
    <div className="space-y-4">
      {[...Array(ITEMS_PER_PAGE)].map((_, index) => (
        <div key={index} className="border rounded-md p-4 space-y-3">
          <div className="flex justify-between items-start">
            <Skeleton className="h-6 w-48 rounded-md bg-muted/20" />
            <Skeleton className="h-6 w-20 rounded-md bg-muted/20" />
          </div>
          <Skeleton className="h-5 w-32 rounded-md bg-muted/20" />
          <Skeleton className="h-5 w-24 rounded-md bg-muted/20" />
          <div className="flex items-center justify-between mt-4">
            <Skeleton className="h-8 w-24 rounded-md bg-muted/20" />
            <Skeleton className="h-8 w-8 rounded-md bg-muted/20" />
          </div>
        </div>
      ))}
    </div>
  );
};

interface ResidenceLeadsProps {
  residenceId: string;
}

export function ResidenceLeads({ residenceId }: ResidenceLeadsProps) {
  const {
    leads,
    loading,
    totalItems,
    totalPages,
    currentPage,
    goToNextPage,
    goToPreviousPage,
    goToPage,
  } = useResidenceLeads({
    residenceId,
    limit: ITEMS_PER_PAGE,
  });

  const { table } = useTable<Lead>({
    data: leads,
    columns: columns,
    initialPageSize: ITEMS_PER_PAGE,
    manualPagination: true,
    pageCount: totalPages,
    enableSorting: false,
    initialSorting: [],
  });

  return (
    <div className="w-full">
      <div className="flex items-center justify-between w-full mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-sans">Leads</h1>
        </div>
      </div>

      {/* Cards for mobile view */}
      <div className="block lg:hidden">
        {loading ? (
          <CardsSkeleton />
        ) : (
          <LeadsCardList leads={table.getRowModel().rows.map(row => row.original)} />
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