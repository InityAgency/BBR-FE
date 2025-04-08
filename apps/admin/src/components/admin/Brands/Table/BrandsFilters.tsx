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

interface BrandType {
  id: string;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface BrandsFiltersProps {
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
  selectedBrandTypeIds: string[];
  setSelectedBrandTypeIds: React.Dispatch<React.SetStateAction<string[]>>;
  selectedStatuses: string[];
  setSelectedStatuses: React.Dispatch<React.SetStateAction<string[]>>;
  brandTypes: BrandType[];
  uniqueStatuses: string[];
  typeSearchValue: string;
  setTypeSearchValue: (value: string) => void;
}

const PREDEFINED_STATUSES = ["ACTIVE", "DRAFT", "PENDING", "DELETED"];

const formatTypeName = (name: string): string => {
  if (!name) return "";
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
};

export function BrandsFilters({
  globalFilter,
  setGlobalFilter,
  selectedBrandTypeIds,
  setSelectedBrandTypeIds,
  selectedStatuses,
  setSelectedStatuses,
  brandTypes = [],
  uniqueStatuses,
  typeSearchValue,
  setTypeSearchValue,
}: BrandsFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [localSearch, setLocalSearch] = useState(globalFilter);
  const debouncedSearch = useDebounce(localSearch, 500);

  const [filteredBrandTypes, setFilteredBrandTypes] =
    useState<BrandType[]>(brandTypes);

  useEffect(() => {
    if (typeSearchValue.trim() === "") {
      setFilteredBrandTypes(brandTypes);
    } else {
      const lowercaseSearch = typeSearchValue.toLowerCase();
      const filtered = brandTypes.filter((brandType) =>
        brandType.name.toLowerCase().includes(lowercaseSearch)
      );
      setFilteredBrandTypes(filtered);
    }
  }, [typeSearchValue, brandTypes]);

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

  const getBrandTypeName = (brandTypeId: string): string => {
    const brandType = brandTypes.find((bt) => bt.id === brandTypeId);
    return brandType ? formatTypeName(brandType.name) : brandTypeId;
  };

  const clearAllFilters = () => {
    setSelectedBrandTypeIds([]);
    setSelectedStatuses([]);
    setGlobalFilter("");
    setLocalSearch("");

    const params = new URLSearchParams();
    params.set("page", "1");

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <>
      <TableFilters
        globalFilter={localSearch}
        setGlobalFilter={handleSearchChange}
        placeholder="Search brands..."
      >
        {/* Brand Type Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="h-10">
              <Tag className="h-4 w-4 mr-2" />
              Brand Types
              {selectedBrandTypeIds.length > 0 && (
                <>
                  <div className="w-px h-4 bg-muted mx-2" />
                  <Badge
                    variant="secondary"
                    className="rounded-sm w-6 h-6 p-0 flex items-center justify-center text-xs"
                  >
                    {selectedBrandTypeIds.length}
                  </Badge>
                </>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-0" align="start">
            <Command>
              <CommandInput
                placeholder="Search Brand Types..."
                value={typeSearchValue}
                onValueChange={setTypeSearchValue}
              />
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                {filteredBrandTypes.map((brandType) => (
                  <CommandItem
                    key={brandType.id}
                    onSelect={() => {
                      setSelectedBrandTypeIds((prev) => {
                        if (prev.includes(brandType.id)) {
                          return prev.filter((item) => item !== brandType.id);
                        } else {
                          return [...prev, brandType.id];
                        }
                      });
                    }}
                  >
                    <Checkbox
                      checked={selectedBrandTypeIds.includes(brandType.id)}
                      className="mr-2 h-4 w-4"
                    />
                    <span className="capitalize">
                      {formatTypeName(brandType.name)}
                    </span>
                  </CommandItem>
                ))}
              </CommandList>
              {selectedBrandTypeIds.length > 0 && (
                <div className="border-t border-border p-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      const params = new URLSearchParams(
                        searchParams.toString()
                      );
                      params.delete("brandTypeId");
                      params.set("page", "1");
                      router.replace(`${pathname}?${params.toString()}`, {
                        scroll: false,
                      });
                      setSelectedBrandTypeIds([]);
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
                    <span className="capitalize">{status.toLowerCase()}</span>
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
      {(selectedBrandTypeIds.length > 0 || selectedStatuses.length > 0) && (
        <div className="flex gap-2 mb-4 flex-wrap">
          {/* Oznake za tipove brendova */}
          {selectedBrandTypeIds.map((brandTypeId) => (
            <Badge
              key={`brandType-${brandTypeId}`}
              variant="secondary"
              className="px-2 py-1"
            >
              <span className="capitalize">{getBrandTypeName(brandTypeId)}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 ml-2"
                onClick={() => {
                  const params = new URLSearchParams(searchParams.toString());
                  const remainingBrandTypeIds = selectedBrandTypeIds.filter(
                    (id) => id !== brandTypeId
                  );
                  params.delete("brandTypeId");
                  remainingBrandTypeIds.forEach((id) =>
                    params.append("brandTypeId", id)
                  );
                  params.set("page", "1");
                  router.replace(`${pathname}?${params.toString()}`, {
                    scroll: false,
                  });
                  setSelectedBrandTypeIds(remainingBrandTypeIds);
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
              <span className="capitalize">{status.toLowerCase()}</span>
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
          {(selectedBrandTypeIds.length > 0 || selectedStatuses.length > 0) && (
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