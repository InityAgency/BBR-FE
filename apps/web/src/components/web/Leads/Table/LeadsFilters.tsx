"use client";

import React, { useEffect, useState } from "react";
import { CircleDashed, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { TableFilters } from "@/components/web/Table/TableFilters";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
  CommandEmpty,
} from "@/components/ui/command";
import { useDebounce } from "@/hooks/useDebounce";

interface LeadsFiltersProps {
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
  selectedStatuses: string[];
  setSelectedStatuses: (statuses: string[]) => void;
  uniqueStatuses: string[];
  updateUrlParams: (params: {
    page?: number;
    query?: string;
    statuses?: string[];
  }) => void;
}

const PREDEFINED_STATUSES = ["NEW", "CONTACTED", "QUALIFIED", "WON", "LOST", "INACTIVE"];

const formatStatus = (status: string): string => {
  if (!status) return "";
  return status
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export function LeadsFilters({
  globalFilter,
  setGlobalFilter,
  selectedStatuses,
  setSelectedStatuses,
  uniqueStatuses,
  updateUrlParams,
}: LeadsFiltersProps) {
  
  const [localSearch, setLocalSearch] = useState(globalFilter);
  const debouncedSearch = useDebounce(localSearch, 500);

  // Update search when debounced value changes
  useEffect(() => {
    if (debouncedSearch !== globalFilter) {
      setGlobalFilter(debouncedSearch);
    }
  }, [debouncedSearch, globalFilter, setGlobalFilter]);

  // Sync local search with external changes
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

  return (
    <div className="custom-form">
      <TableFilters
        globalFilter={localSearch}
        setGlobalFilter={handleSearchChange}
        placeholder="Search leads..."
      />
    </div>
  );
}