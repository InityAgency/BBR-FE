"use client";

import React from "react";
import { TableFilters } from "@/components/admin/Table/TableFilters";

interface AmenitiesFiltersProps {
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
}

export function AmenitiesFilters({
  globalFilter,
  setGlobalFilter,
}: AmenitiesFiltersProps) {
  return (
    <TableFilters
      globalFilter={globalFilter}
      setGlobalFilter={setGlobalFilter}
      placeholder="Search amenities..."
    />
  );
}
