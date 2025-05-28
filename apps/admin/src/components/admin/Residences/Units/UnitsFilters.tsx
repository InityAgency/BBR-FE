"use client";

import React, { useEffect, useState } from "react";
import { TableFilters } from "@/components/admin/Table/TableFilters";
import { useDebounce } from "@/hooks/useDebounce";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface UnitsFiltersProps {
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
  selectedStatuses: string[];
  setSelectedStatuses: React.Dispatch<React.SetStateAction<string[]>>;
  uniqueStatuses: string[];
  updateUrlParams: (params: { page: number; query: string; statuses: string[] }) => void;
}

export function UnitsFilters({
  globalFilter,
  setGlobalFilter,
  selectedStatuses,
  setSelectedStatuses,
  uniqueStatuses,
  updateUrlParams,
}: UnitsFiltersProps) {
  const [localSearch, setLocalSearch] = useState(globalFilter);
  const debouncedSearch = useDebounce(localSearch, 500);

  useEffect(() => {
    if (debouncedSearch !== globalFilter) {
      setGlobalFilter(debouncedSearch);
    }
  }, [debouncedSearch, globalFilter, setGlobalFilter]);

  useEffect(() => {
    if (globalFilter !== localSearch) {
      setLocalSearch(globalFilter);
    }
  }, [globalFilter]);

  const handleSearchChange = (value: string) => {
    setLocalSearch(value);
  };

  const clearAllFilters = () => {
    setSelectedStatuses([]);
    setLocalSearch("");
    updateUrlParams({ page: 1, query: "", statuses: [] });
  };

  const handleStatusChange = (status: string) => {
    const newStatuses = selectedStatuses.includes(status)
      ? selectedStatuses.filter((item) => item !== status)
      : [...selectedStatuses, status];
    setSelectedStatuses(newStatuses);
  };

  const clearStatuses = () => {
    setSelectedStatuses([]);
  };

  const removeStatus = (status: string) => {
    const newStatuses = selectedStatuses.filter((s) => s !== status);
    setSelectedStatuses(newStatuses);
  };

  return (
    <div className="space-y-4">
      <TableFilters
        globalFilter={localSearch}
        setGlobalFilter={handleSearchChange}
        placeholder="Search units..."
      >
        {(selectedStatuses.length > 0 || localSearch) && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Clear all
          </button>
        )}
      </TableFilters>

      <div className="flex flex-wrap gap-2">
        {uniqueStatuses.map((status) => (
          <button
            key={status}
            onClick={() => handleStatusChange(status)}
            className={`px-3 py-1 text-sm rounded-full border ${
              selectedStatuses.includes(status)
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background text-foreground border-border hover:bg-accent"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {(selectedStatuses.length > 0 || localSearch) && (
        <div className="flex flex-wrap gap-2">
          {selectedStatuses.map((status) => (
            <Badge
              key={status}
              variant="secondary"
              className="flex items-center gap-1"
            >
              {status}
              <button
                onClick={() => removeStatus(status)}
                className="ml-1 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {localSearch && (
            <Badge
              variant="secondary"
              className="flex items-center gap-1"
            >
              Search: {localSearch}
              <button
                onClick={() => setLocalSearch("")}
                className="ml-1 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
} 