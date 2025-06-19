"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface ClaimRequestsFiltersProps {
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
}

export function ClaimRequestsFilters({ globalFilter, setGlobalFilter }: ClaimRequestsFiltersProps) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search by name, email, residence..."
          value={globalFilter ?? ""}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="pl-10"
        />
      </div>
    </div>
  );
} 