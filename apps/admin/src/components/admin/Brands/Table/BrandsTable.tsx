// components/admin/Brands/Table/BrandsTable.tsx
"use client";

import React from "react";
import { useTable } from "@/hooks/useTable";
import { useTableFilters } from "@/hooks/useTableFilters";
import { BaseTable } from "@/components/admin/Table/BaseTable";
import { TablePagination } from "@/components/admin/Table/TablePagination";
import { BrandsFilters } from "./BrandsFilters";
import { columns } from "./BrandsColumns";
import { brandsData } from "@/app/data/brands";
import { Brand } from "../../../../app/types/models/Brand";
import { fuzzyFilter } from "@/lib/tableFilters";
import { CellContext } from "@tanstack/react-table";
import { BrandsActions } from "./BrandsActions";

// Popravka za kolone da koriste BrandsActions
const enhancedColumns = columns.map(column => {
  if (column.id === "actions") {
    return {
      ...column,
      cell: (props: CellContext<Brand, unknown>) => <BrandsActions row={props.row} />
    };
  }
  return column;
});

export function BrandsTable() {
  // Koristimo generički hook za tabelu
  const {
    table,
    globalFilter,
    setGlobalFilter,
  } = useTable<Brand>({
    data: brandsData,
    columns: enhancedColumns,
    initialSorting: [{ id: "updatedAt", desc: true }],
    globalFilterFn: (row, columnId, value, addMeta) => {
      // Koristimo našu univerzalnu funkciju
      const result = fuzzyFilter(row, columnId, value, addMeta);
      
      // Dodatno proveravamo ID polje eksplicitno
      const id = row.original.id || "";
      const searchValue = String(value).toLowerCase();
      
      // Vraćamo true ako je univerzalna pretraga uspela ILI ako ID sadrži traženi tekst
      return result || id.toLowerCase().includes(searchValue);
    },
    initialPageSize: 10,
  });

  // Koristimo hook za filtere
  const {
    selectedLocations: selectedTypes,
    setSelectedLocations: setSelectedTypes,
    locationSearchValue: typeSearchValue,
    setLocationSearchValue: setTypeSearchValue,
    selectedStatuses,
    setSelectedStatuses,
    uniqueLocations: uniqueTypes,
    uniqueStatuses,
    filteredLocations: filteredTypes,
  } = useTableFilters<Brand>({
    table,
    data: brandsData,
    locationAccessor: "type",
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
      <BrandsFilters
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        selectedTypes={selectedTypes}
        setSelectedTypes={setSelectedTypes}
        selectedStatuses={selectedStatuses}
        setSelectedStatuses={setSelectedStatuses}
        uniqueTypes={uniqueTypes}
        uniqueStatuses={uniqueStatuses}
        filteredTypes={filteredTypes}
        typeSearchValue={typeSearchValue}
        setTypeSearchValue={setTypeSearchValue}
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

export default BrandsTable;