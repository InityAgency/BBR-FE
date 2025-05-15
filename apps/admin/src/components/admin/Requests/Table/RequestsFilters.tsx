"use client";

import React, { useEffect, useState } from "react";
import { CircleDashed, X, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { TableFilters } from "@/components/admin/Table/TableFilters";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
  CommandEmpty,
} from "@/components/ui/command";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";

interface RequestsFiltersProps {
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
  selectedTypes: string[];
  setSelectedTypes: React.Dispatch<React.SetStateAction<string[]>>;
  selectedStatuses: string[];
  setSelectedStatuses: React.Dispatch<React.SetStateAction<string[]>>;
  uniqueStatuses: string[];
  uniqueTypes: string[];
  typeSearchValue: string;
  setTypeSearchValue: (value: string) => void;
}

const PREDEFINED_STATUSES = ["NEW", "IN_PROGRESS", "COMPLETED", "CANCELLED"];

const formatTypeName = (name: string): string => {
  if (!name) return "";
  return name
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

const formatStatus = (status: string): string => {
  if (!status) return "";
  return status
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export function RequestsFilters({
  globalFilter,
  setGlobalFilter,
  selectedTypes,
  setSelectedTypes,
  selectedStatuses,
  setSelectedStatuses,
  uniqueStatuses,
  uniqueTypes,
  typeSearchValue,
  setTypeSearchValue,
}: RequestsFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [localSearch, setLocalSearch] = useState(globalFilter);
  const debouncedSearch = useDebounce(localSearch, 500);

  const handleSearchChange = (value: string) => {
    setLocalSearch(value);
  };

  useEffect(() => {
    const currentQuery = searchParams.get("query") || "";
    if (debouncedSearch !== currentQuery) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", "1");

      if (debouncedSearch) {
        params.set("query", debouncedSearch);
      } else {
        params.delete("query");
      }

      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }
  }, [debouncedSearch, router, pathname, searchParams]);

  useEffect(() => {
    const queryParam = searchParams.get("query");
    if (queryParam !== localSearch) {
      setLocalSearch(queryParam || "");
    }
  }, [searchParams]);

  const clearAllFilters = () => {
    setSelectedTypes([]);
    setSelectedStatuses([]);
    setGlobalFilter("");
    setLocalSearch("");

    const params = new URLSearchParams();
    params.set("page", "1");

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // Prikazujemo uvek sve tipove, filtrirane po pretrazi, ali ne sakrivamo selektovane
  const allTypes = Array.from(new Set([...(uniqueTypes || []), ...selectedTypes]));
  const filteredTypes = typeSearchValue.trim() === ""
    ? allTypes
    : allTypes.filter((type) =>
        formatTypeName(type).toLowerCase().includes(typeSearchValue.toLowerCase())
      );

  return (
    <>
      <TableFilters
        globalFilter={localSearch}
        setGlobalFilter={handleSearchChange}
        placeholder="Search requests..."
      >
        {/* Request Type Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="h-10">
              <Tag className="h-4 w-4 mr-2" />
              Request Types
              {selectedTypes.length > 0 && (
                <>
                  <div className="w-px h-4 bg-muted mx-2" />
                  <Badge
                    variant="secondary"
                    className="rounded-sm w-6 h-6 p-0 flex items-center justify-center text-xs"
                  >
                    {selectedTypes.length}
                  </Badge>
                </>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-0" align="start">
            <Command>
              <CommandInput
                placeholder="Search Request Types..."
                value={typeSearchValue}
                onValueChange={setTypeSearchValue}
              />
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                {filteredTypes.map((type) => (
                  <CommandItem
                    key={type}
                    onSelect={() => {
                      setSelectedTypes((prev) => {
                        if (prev.includes(type)) {
                          return prev.filter((item) => item !== type);
                        } else {
                          return [...prev, type];
                        }
                      });
                    }}
                  >
                    <Checkbox
                      checked={selectedTypes.includes(type)}
                      className="mr-2 h-4 w-4"
                    />
                    <span className="capitalize">
                      {formatTypeName(type)}
                    </span>
                  </CommandItem>
                ))}
              </CommandList>
              {selectedTypes.length > 0 && (
                <div className="border-t border-border p-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      const params = new URLSearchParams(
                        searchParams.toString()
                      );
                      params.delete("type");
                      params.set("page", "1");
                      router.replace(`${pathname}?${params.toString()}`, {
                        scroll: false,
                      });
                      setSelectedTypes([]);
                    }}
                  >
                    Clear
                    <X className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              )}
            </Command>
          </PopoverContent>
        </Popover>

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
                    onSelect={() => {
                      setSelectedStatuses((prev) => {
                        if (prev.includes(status)) {
                          return prev.filter((item) => item !== status);
                        } else {
                          return [...prev, status];
                        }
                      });
                    }}
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
                    onClick={() => {
                      const params = new URLSearchParams(
                        searchParams.toString()
                      );
                      params.delete("status");
                      params.set("page", "1");
                      router.replace(`${pathname}?${params.toString()}`, {
                        scroll: false,
                      });
                      setSelectedStatuses([]);
                    }}
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

      {/* Prikaz aktivnih filtera */}
      {(selectedTypes.length > 0 || selectedStatuses.length > 0) && (
        <div className="flex gap-2 mb-4 flex-wrap">
          {/* Oznake za tipove zahteva */}
          {selectedTypes.map((type) => (
            <Badge
              key={`type-${type}`}
              variant="secondary"
              className="px-2 py-1"
            >
              <span className="capitalize">{formatTypeName(type)}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 ml-2"
                onClick={() => {
                  const params = new URLSearchParams(searchParams.toString());
                  const remainingTypes = selectedTypes.filter(
                    (t) => t !== type
                  );
                  params.delete("type");
                  remainingTypes.forEach((t) =>
                    params.append("type", t)
                  );
                  params.set("page", "1");
                  router.replace(`${pathname}?${params.toString()}`, {
                    scroll: false,
                  });
                  setSelectedTypes(remainingTypes);
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}

          {/* Oznake za statuse */}
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
                onClick={() => {
                  const params = new URLSearchParams(searchParams.toString());
                  const remainingStatuses = selectedStatuses.filter(
                    (s) => s !== status
                  );
                  params.delete("status");
                  remainingStatuses.forEach((s) => params.append("status", s));
                  params.set("page", "1");
                  router.replace(`${pathname}?${params.toString()}`, {
                    scroll: false,
                  });
                  setSelectedStatuses(remainingStatuses);
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}

          {/* Dugme za brisanje svih filtera */}
          {(selectedTypes.length > 0 || selectedStatuses.length > 0) && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2"
              onClick={clearAllFilters}
            >
              Clear All
            </Button>
          )}
        </div>
      )}
    </>
  );
} 