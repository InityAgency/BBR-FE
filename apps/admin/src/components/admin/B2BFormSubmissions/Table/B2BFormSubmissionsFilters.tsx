"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface B2BFormSubmissionsFiltersProps {
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

export function B2BFormSubmissionsFilters({
  globalFilter,
  setGlobalFilter,
  selectedStatuses,
  setSelectedStatuses,
  uniqueStatuses,
  updateUrlParams,
}: B2BFormSubmissionsFiltersProps) {
  const handleStatusChange = (status: string) => {
    const newStatuses = selectedStatuses.includes(status)
      ? selectedStatuses.filter((s) => s !== status)
      : [...selectedStatuses, status];
    setSelectedStatuses(newStatuses);
    updateUrlParams({ statuses: newStatuses, page: 1 });
  };

  const clearAllFilters = () => {
    setGlobalFilter("");
    setSelectedStatuses([]);
    updateUrlParams({ query: "", statuses: [], page: 1 });
  };

  const hasActiveFilters = globalFilter || selectedStatuses.length > 0;

  return (
    <div className="space-y-4">
      {/* Search and Clear Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search submissions..."
            value={globalFilter}
            onChange={(e) => {
              setGlobalFilter(e.target.value);
              updateUrlParams({ query: e.target.value, page: 1 });
            }}
            className="pl-8"
          />
        </div>
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearAllFilters}
            className="flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Clear Filters
          </Button>
        )}
      </div>

      {/* Status Filters */}
      {uniqueStatuses.length > 0 && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Filter by Status:</label>
          <div className="flex flex-wrap gap-2">
            {uniqueStatuses.map((status) => (
              <Badge
                key={status}
                variant={selectedStatuses.includes(status) ? "default" : "outline"}
                className="cursor-pointer hover:bg-primary/80"
                onClick={() => handleStatusChange(status)}
              >
                {status}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {globalFilter && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Search: {globalFilter}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => {
                  setGlobalFilter("");
                  updateUrlParams({ query: "", page: 1 });
                }}
              />
            </Badge>
          )}
          {selectedStatuses.map((status) => (
            <Badge
              key={status}
              variant="secondary"
              className="flex items-center gap-1"
            >
              Status: {status}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleStatusChange(status)}
              />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
} 