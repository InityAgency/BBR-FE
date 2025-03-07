// components/admin/Residences/Table/ResidencesTable.tsx
"use client";

import React from "react";
import { useTable } from "@/hooks/useTable";
import { useTableFilters } from "@/hooks/useTableFilters";
import { BaseTable } from "@/components/admin/Table/BaseTable";
import { TablePagination } from "@/components/admin/Table/TablePagination";
import { ResidencesFilters } from "./ResidencesFilters";
import { columns } from "./ResidencesColumns";
import { residencesData } from "@/app/data/residences";
import { Residence } from "../../../../app/types/models/Residence";
import { fuzzyFilter } from "@/lib/tableFilters";
import { CellContext } from "@tanstack/react-table";
import { ResidencesActions } from "./ResidencesActions";

// Popravka za kolone da koriste ResidencesActions
const enhancedColumns = columns.map(column => {
  if (column.id === "actions") {
    return {
      ...column,
      cell: (props: CellContext<Residence, unknown>) => <ResidencesActions row={props.row} />
    };
  }
  return column;
});

export function ResidencesTable() {
  // Koristimo generički hook za tabelu
  const {
    table,
    globalFilter,
    setGlobalFilter,
  } = useTable<Residence>({
    data: residencesData,
    columns: enhancedColumns,
    initialSorting: [{ id: "createdAt", desc: true }],
    globalFilterFn: fuzzyFilter,
    initialPageSize: 12,
  });

  // Koristimo hook za filtere
  const {
    selectedLocations,
    setSelectedLocations,
    locationSearchValue,
    setLocationSearchValue,
    selectedStatuses,
    setSelectedStatuses,
    uniqueLocations,
    uniqueStatuses,
    filteredLocations,
  } = useTableFilters<Residence>({
    table,
    data: residencesData,
    locationAccessor: "location",
    statusAccessor: "status",
  });

  // Helper funkcije za stilizovanje redova i ćelija
  const getRowClassName = (row: any) => {
    const status = row.original.status;
    if (status === "Deleted") return "opacity-60";
    if (status === "Draft") return "opacity-80";
    return "";
  };

  return (
    <div className="w-full">
      {/* Filteri */}
      <ResidencesFilters
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        selectedLocations={selectedLocations}
        setSelectedLocations={setSelectedLocations}
        selectedStatuses={selectedStatuses}
        setSelectedStatuses={setSelectedStatuses}
        uniqueLocations={uniqueLocations}
        uniqueStatuses={uniqueStatuses}
        filteredLocations={filteredLocations}
        locationSearchValue={locationSearchValue}
        setLocationSearchValue={setLocationSearchValue}
      />

      {/* Tabela */}
      <BaseTable 
        table={table}
        getRowClassName={getRowClassName}
      />

      {/* Paginacija */}
      <TablePagination table={table} />
    </div>
  );
}

export default ResidencesTable;