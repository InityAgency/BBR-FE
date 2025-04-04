"use client";

import React, { useEffect, useState } from "react";
import { CircleDashed, X, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { TableFilters } from "@/components/admin/Table/TableFilters";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandInput, CommandItem, CommandList, CommandEmpty } from "@/components/ui/command";

interface RankingCategoryFiltersProps {
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
  selectedTypes: string[];
  setSelectedTypes: React.Dispatch<React.SetStateAction<string[]>>;
  selectedStatuses: string[];
  setSelectedStatuses: React.Dispatch<React.SetStateAction<string[]>>;
  uniqueStatuses: string[];
  filteredTypes: string[];
  typeSearchValue: string;
  setTypeSearchValue: (value: string) => void;
}

// Privremena funkcija za dobijanje tipova kategorija
const fetchRankingCategoryTypes = async () => {
  try {
    const response = await fetch('/api/v1/ranking-category-types');
    if (!response.ok) {
      throw new Error('Failed to fetch ranking category types');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching ranking category types:', error);
    return [];
  }
};

export function RankingCategoryFilters({
  globalFilter,
  setGlobalFilter,
  selectedTypes,
  setSelectedTypes,
  selectedStatuses,
  setSelectedStatuses,
  uniqueStatuses,
  filteredTypes,
  typeSearchValue,
  setTypeSearchValue,
}: RankingCategoryFiltersProps) {
  const [categoryTypes, setCategoryTypes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadCategoryTypes = async () => {
      setIsLoading(true);
      try {
        const types = await fetchRankingCategoryTypes();
        setCategoryTypes(types);
      } catch (error) {
        console.error('Error loading category types:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCategoryTypes();
  }, []);

  return (
    <>
      <TableFilters
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        placeholder="Enter category name, type ..."
      >
        {/* Type Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="h-10">
              <Tag className="h-4 w-4 mr-2" />
              Category Types
              {selectedTypes.length > 0 && (
                <>
                  <div className="w-px h-4 bg-muted mx-2" />
                  <Badge variant="secondary" className="rounded-sm w-6 h-6 p-0 flex items-center justify-center text-xs">
                    {selectedTypes.length}
                  </Badge>
                </>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-0" align="start">
            <Command>
              <CommandInput 
                placeholder="Search Category Types..." 
                value={typeSearchValue}
                onValueChange={setTypeSearchValue}
              />
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                {isLoading ? (
                  <div className="p-2 text-sm text-muted-foreground">Loading...</div>
                ) : (
                  filteredTypes.map((type) => (
                    <CommandItem
                      key={type}
                      onSelect={() => {
                        setSelectedTypes((prev) => {
                          if (prev.includes(type)) {
                            return prev.filter(item => item !== type);
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
                      {type}
                    </CommandItem>
                  ))
                )}
              </CommandList>
              {selectedTypes.length > 0 && (
                <div className="border-t border-border p-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => setSelectedTypes([])}
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
                  <Badge variant="secondary" className="rounded-sm w-6 h-6 p-0 flex items-center justify-center text-xs">
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
                {uniqueStatuses.map((status) => (
                  <CommandItem
                    key={status}
                    onSelect={() => {
                      setSelectedStatuses((prev) => {
                        if (prev.includes(status)) {
                          return prev.filter(item => item !== status);
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
                    {status}
                  </CommandItem>
                ))}
              </CommandList>
              {selectedStatuses.length > 0 && (
                <div className="border-t border-border p-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => setSelectedStatuses([])}
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
          {/* Oznake za tipove */}
          {selectedTypes.map(type => (
            <Badge key={`type-${type}`} variant="secondary" className="px-2 py-1">
              {type}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 ml-2"
                onClick={() => setSelectedTypes(prev => prev.filter(t => t !== type))}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
          
          {/* Oznake za statuse */}
          {selectedStatuses.map(status => (
            <Badge key={`status-${status}`} variant="secondary" className="px-2 py-1">
              {status}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 ml-2"
                onClick={() => setSelectedStatuses(prev => prev.filter(s => s !== status))}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
          
          {/* Dugme za brisanje svih filtera */}
          {(selectedTypes.length > 1 || selectedStatuses.length > 1) && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2"
              onClick={() => {
                setSelectedTypes([]);
                setSelectedStatuses([]);
              }}
            >
              Clear All
            </Button>
          )}
        </div>
      )}
    </>
  );
}
