"use client";

import React from "react";
import { MapPinPlusInside, CircleDashed, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { TableFilters } from "@/components/admin/Table/TableFilters";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandInput, CommandItem, CommandList, CommandEmpty } from "@/components/ui/command";
import { Residence } from "../../../../app/types/models/Residence";

interface ResidencesFiltersProps {
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
  selectedLocations: string[];
  setSelectedLocations: React.Dispatch<React.SetStateAction<string[]>>;
  selectedStatuses: string[];
  setSelectedStatuses: React.Dispatch<React.SetStateAction<string[]>>;
  uniqueLocations: string[];
  uniqueStatuses: string[];
  filteredLocations: string[];
  locationSearchValue: string;
  setLocationSearchValue: (value: string) => void;
}

export function ResidencesFilters({
  globalFilter,
  setGlobalFilter,
  selectedLocations,
  setSelectedLocations,
  selectedStatuses,
  setSelectedStatuses,
  uniqueLocations,
  uniqueStatuses,
  filteredLocations,
  locationSearchValue,
  setLocationSearchValue,
}: ResidencesFiltersProps) {
  return (
    <>
      <TableFilters
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        placeholder="Enter residence name, developer or location..."
      >
        {/* Location Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="h-10">
              <MapPinPlusInside className="h-4 w-4 mr-2" />
              Locations
              {selectedLocations.length > 0 && (
                <>
                  <div className="w-px h-4 bg-muted mx-2" />
                  <Badge variant="secondary" className="rounded-sm w-6 h-6 p-0 flex items-center justify-center text-xs">
                    {selectedLocations.length}
                  </Badge>
                </>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-0" align="start">
            <Command>
              <CommandInput 
                placeholder="Search Locations..." 
                value={locationSearchValue}
                onValueChange={setLocationSearchValue}
              />
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                {filteredLocations.map((location) => (
                  <CommandItem
                    key={location}
                    onSelect={() => {
                      setSelectedLocations((prev) => {
                        if (prev.includes(location)) {
                          return prev.filter(item => item !== location);
                        } else {
                          return [...prev, location];
                        }
                      });
                    }}
                  >
                    <Checkbox
                      checked={selectedLocations.includes(location)}
                      className="mr-2 h-4 w-4"
                    />
                    {location}
                  </CommandItem>
                ))}
              </CommandList>
              {selectedLocations.length > 0 && (
                <div className="border-t border-border p-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => setSelectedLocations([])}
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
      {(selectedLocations.length > 0 || selectedStatuses.length > 0) && (
        <div className="flex gap-2 mb-4 flex-wrap">
          {/* Oznake za lokacije */}
          {selectedLocations.map(location => (
            <Badge key={`loc-${location}`} variant="secondary" className="px-2 py-1">
              {location}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 ml-2"
                onClick={() => setSelectedLocations(prev => prev.filter(l => l !== location))}
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
          {(selectedLocations.length > 1 || selectedStatuses.length > 1) && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2"
              onClick={() => {
                setSelectedLocations([]);
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