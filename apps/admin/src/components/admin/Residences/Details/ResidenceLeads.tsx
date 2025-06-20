"use client";

import { useTable } from "@/hooks/useTable";
import { BaseTable } from "@/components/admin/Table/BaseTable";
import { columns } from "@/components/admin/Leads/Table/LeadsColumns";
import { TablePagination } from "@/components/admin/Table/TablePagination";
import { Skeleton } from "@/components/ui/skeleton";
import { Lead } from "@/types/models/Lead";
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

interface ResidenceLeadsProps {
  residenceId: string;
}

export function ResidenceLeads({ residenceId }: ResidenceLeadsProps) {
  const {
    leads,
    loading,
    error,
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

  if (loading) {
    return (
      <div className="w-full">
        <div className="flex items-center justify-between w-full mb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-sans">Leads</h1>
          </div>
        </div>
        <TableSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full">
        <div className="flex items-center justify-between w-full mb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-sans">Leads</h1>
          </div>
        </div>
        <div className="rounded-md border p-4 text-center">
          <p className="text-muted-foreground">Error loading leads: {error}</p>
        </div>
      </div>
    );
  }

  if (!leads || leads.length === 0) {
    return (
      <div className="w-full">
        <div className="flex items-center justify-between w-full mb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-sans">Leads</h1>
          </div>
        </div>
        <div className="rounded-md border p-4 text-center">
          <p className="text-muted-foreground">No leads available for this residence.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between w-full mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-sans">Leads</h1>
        </div>
      </div>

      <div className="space-y-4">
        <BaseTable table={table} />
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
    </div>
  );
} 