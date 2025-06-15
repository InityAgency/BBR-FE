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
    <div className="custom-form">
      <TableFilters
        globalFilter={localSearch}
        setGlobalFilter={handleSearchChange}
        placeholder="Search leads..."
      >
        {/* Status Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="h-10">
              <CircleDashed className="h-4 w-4 mr-2" />
              Status
              {selectedStatuses.length > 0 && (
                <>
                  <div className="w-px h-4 bg-muted mx-2" />
                  <Badge
                    variant="secondary"
                    className="rounded-sm w-6 h-6 p-0 flex items-center justify-center text-xs"
                  >
                    {selectedStatuses.length}
                  </Badge>
                </>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-0" align="start">
            <Command>
              <CommandList>
                <CommandEmpty>No statuses found.</CommandEmpty>
                {PREDEFINED_STATUSES.map((status) => (
                  <CommandItem
                    key={status}
                    onSelect={() => handleStatusChange(status)}
                  >
                    <Checkbox
                      checked={selectedStatuses.includes(status)}
                      className="mr-2 h-4 w-4"
                    />
                    <span className="capitalize">{formatStatus(status)}</span>
                  </CommandItem>
                ))}
              </CommandList>
              {selectedStatuses.length > 0 && (
                <div className="border-t border-border p-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={clearStatuses}
                  >
                    Clear
                    <X className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              )}
            </Command>
          </PopoverContent>
        </Popover>
      </TableFilters>

      {/* Active filters display */}
      {selectedStatuses.length > 0 && (
        <div className="flex gap-2 mb-4 flex-wrap">
          {/* Status badges */}
          {selectedStatuses.map((status) => (
            <Badge
              key={`status-${status}`}
              variant="secondary"
              className="px-2 py-1"
            >
              <span className="capitalize">{formatStatus(status)}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 ml-2"
                onClick={() => removeStatus(status)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}

          {/* Clear all button */}
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2"
            onClick={clearAllFilters}
          >
            Clear All
          </Button>
        </div>
      )}
    </div>
  );
}