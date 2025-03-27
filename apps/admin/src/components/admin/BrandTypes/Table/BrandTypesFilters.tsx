"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface BrandTypesFiltersProps {
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
}

export function BrandTypesFilters({
  globalFilter,
  setGlobalFilter,
}: BrandTypesFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 py-4">
      <div className="w-full sm:max-w-xs relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by ID, name..."
          value={globalFilter || ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="w-full pl-8"
        />
      </div>
    </div>
  );
} 