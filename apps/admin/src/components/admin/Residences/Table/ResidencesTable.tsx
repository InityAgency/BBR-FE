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
import { ResidencesCardList } from "../Cards/ResidencesCardList";

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

export const ResidencesTable = () => {
  // Koristimo generički hook za tabelu
  const {
    table,
    globalFilter,
    setGlobalFilter,
  } = useTable<Residence>({
    data: residencesData,
    columns: enhancedColumns,
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

  return (
    <div className="w-full">
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

      <div className="block lg:hidden">
        <ResidencesCardList 
          residences={table.getRowModel().rows.map(row => row.original)} 
        />
      </div>

      <div className="hidden lg:block">
        <BaseTable table={table} />
      </div>

      <TablePagination table={table} />
    </div>
  );
};

export default ResidencesTable;