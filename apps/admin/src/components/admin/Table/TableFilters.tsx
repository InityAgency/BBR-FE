"use client";

import React from "react";
import { Input } from "@/components/ui/input";

interface TableFiltersProps {
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
  placeholder?: string;
  children?: React.ReactNode;
}

export function TableFilters({
  globalFilter,
  setGlobalFilter,
  placeholder = "Search...",
  children,
}: TableFiltersProps) {
  return (
    <div className="flex items-center pb-4 gap-4 flex-wrap">
      <Input
        placeholder={placeholder}
        value={globalFilter}
        onChange={(event) => setGlobalFilter(event.target.value)}
        className="max-w-sm"
      />
      {children}
    </div>
  );
}