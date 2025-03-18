"use client";

import React from "react";
import { useTable } from "@/hooks/useTable";
import { useTableFilters } from "@/hooks/useTableFilters";
import { BaseTable } from "@/components/admin/Table/BaseTable";
import { TablePagination } from "@/components/admin/Table/TablePagination";
import { UsersFilters } from "./UsersFilters";
import { columns } from "./UsersColumns";
import { usersData } from "@/app/data/users";
import { User } from "@/app/types/models/User";
import { fuzzyFilter } from "@/lib/tableFilters";
import { CellContext } from "@tanstack/react-table";
import { UsersActions } from "./UsersActions";
import { UsersCardList } from "../Cards/UsersCardList";

// Popravka za kolone da koriste UsersActions
const enhancedColumns = columns.map(column => {
  if (column.id === "actions") {
    return {
      ...column,
      cell: (props: CellContext<User, unknown>) => <UsersActions row={props.row} />
    };
  }
  return column;
});

export function UsersTable() {
  // Koristimo generički hook za tabelu
  const {
    table,
    globalFilter,
    setGlobalFilter,
  } = useTable<User>({
    data: usersData,
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
    initialPageSize: 10,
  });

  // Koristimo hook za filtere sa podrškom za ugneždena polja
  const {
    selectedLocations: selectedRoles,
    setSelectedLocations: setSelectedRoles,
    locationSearchValue: roleSearchValue,
    setLocationSearchValue: setRoleSearchValue,
    selectedStatuses,
    setSelectedStatuses,
    uniqueLocations: uniqueRoles,
    uniqueStatuses,
    filteredLocations: filteredRoles,
  } = useTableFilters<User>({
    table,
    data: usersData,
    locationAccessor: "role", // Koristimo "role" kao polje
    statusAccessor: "status",
    useNestedFilter: true, // Omogućavamo filtriranje ugneždenih polja
    nestedField: "name" // Koristimo "name" kao ugneždeno polje
  });

  // Helper funkcije za stilizovanje redova
  const getRowClassName = (row: any) => {
    const status = row.original.status;
    if (status === "Blocked") return "opacity-60";
    if (status === "Deleted") return "opacity-60";
    return "";
  };

  return (
    <div className="w-full">
      {/* Filteri */}
      <UsersFilters
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        selectedRoles={selectedRoles}
        setSelectedRoles={setSelectedRoles}
        selectedStatuses={selectedStatuses}
        setSelectedStatuses={setSelectedStatuses}
        uniqueRoles={uniqueRoles}
        uniqueStatuses={uniqueStatuses}
        filteredRoles={filteredRoles}
        roleSearchValue={roleSearchValue}
        setRoleSearchValue={setRoleSearchValue}
      />

      {/* Kartice za mobilni prikaz */}
      <div className="block lg:hidden">
        <UsersCardList users={table.getRowModel().rows.map(row => row.original)} />
      </div>

      {/* Tabela za desktop prikaz */}
      <div className="hidden lg:block">
        <BaseTable 
          table={table}
          getRowClassName={getRowClassName}
        />
      </div>

      {/* Paginacija */}
      <TablePagination table={table} />
    </div>
  );
} 