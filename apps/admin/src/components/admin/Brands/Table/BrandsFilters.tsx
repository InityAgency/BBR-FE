// components/admin/Brands/Table/BrandsFilters.tsx
"use client";

import React, { useEffect, useState } from "react";
import { CircleDashed, X, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { TableFilters } from "@/components/admin/Table/TableFilters";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandInput, CommandItem, CommandList, CommandEmpty } from "@/components/ui/command";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";

interface BrandsFiltersProps {
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
  selectedTypes: string[];
  setSelectedTypes: React.Dispatch<React.SetStateAction<string[]>>;
  selectedStatuses: string[];
  setSelectedStatuses: React.Dispatch<React.SetStateAction<string[]>>;
  uniqueTypes: string[];
  uniqueStatuses: string[];
  filteredTypes: string[];
  typeSearchValue: string;
  setTypeSearchValue: (value: string) => void;
}

export function BrandsFilters({
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
}: BrandsFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Kreiramo lokalno stanje da pratimo vrednost pretrage
  const [localSearch, setLocalSearch] = useState(globalFilter);
  const debouncedSearch = useDebounce(localSearch, 500); // Debounce za 500ms
  
  // Handler koji se pokreće kada se promeni vrednost u input polju
  const handleSearchChange = (value: string) => {
    setLocalSearch(value);
  };
  
  // Efekat koji se pokreće kada se promeni debouncedSearch vrednost
  useEffect(() => {
    // Samo ako se debounce vrednost stvarno razlikuje od trenutnog URL parametra
    const currentQuery = searchParams.get('query') || '';
    
    if (debouncedSearch !== currentQuery) {
      // Kreiramo novi URLSearchParams objekat na osnovu trenutnih parametara
      const params = new URLSearchParams(searchParams.toString());
      
      // Resetujemo stranicu na 1 kad god se promeni pretraga
      params.set('page', '1');
      
      // Ako postoji vrednost pretrage, dodajemo je u URL, inače je uklanjamo
      if (debouncedSearch) {
        params.set('query', debouncedSearch);
      } else {
        params.delete('query');
      }
      
      // Koristimo replace umesto push da ne dodajemo previše u istoriju
      router.replace(`${pathname}?${params.toString()}`);
    }
  }, [debouncedSearch, router, pathname, searchParams]);
  
  // Postavlja inicijalnu vrednost pretrage iz URL-a i ažurira je kad se URL promeni
  useEffect(() => {
    const queryParam = searchParams.get('query');
    if (queryParam !== localSearch) {
      setLocalSearch(queryParam || '');
    }
  }, [searchParams]);

  return (
    <>
      <TableFilters
        globalFilter={localSearch}
        setGlobalFilter={handleSearchChange}
        placeholder="Search brands..."
      >
        {/* Type Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="h-10">
              <Tag className="h-4 w-4 mr-2" />
              Brand Types
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
                placeholder="Search Brand Types..." 
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
                ))}
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